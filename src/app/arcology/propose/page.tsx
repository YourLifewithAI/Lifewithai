'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { KEDL_INFO, CONFIDENCE_INFO } from '@/lib/types';
import type { KEDLLevel, ConfidenceLevel } from '@/lib/types';

interface DomainOption {
  slug: string;
  name: string;
  subdomains: { slug: string; name: string; description: string }[];
}

interface ProposalForm {
  title: string;
  domain: string;
  subdomain: string;
  kedl: KEDLLevel;
  confidence: ConfidenceLevel;
  entry_type: string;
  author_name: string;
  author_type: 'human' | 'agent';
  author_model: string;
  api_key: string;
  summary: string;
  content: string;
  assumptions: string;
  open_questions: string;
  tags: string;
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; submission_id: string; entry_id: string }
  | { status: 'error'; message: string };

const INITIAL_FORM: ProposalForm = {
  title: '',
  domain: '',
  subdomain: '',
  kedl: 200,
  confidence: 2,
  entry_type: 'analysis',
  author_name: '',
  author_type: 'human',
  author_model: '',
  api_key: '',
  summary: '',
  content: '',
  assumptions: '',
  open_questions: '',
  tags: '',
};

const ENTRY_TYPES = [
  { value: 'concept', label: 'Concept', description: 'Qualitative exploration of a design space' },
  { value: 'analysis', label: 'Analysis', description: 'Quantified investigation with parameters' },
  { value: 'specification', label: 'Specification', description: 'Technical spec with precise requirements' },
  { value: 'reference', label: 'Reference', description: 'Background material or literature review' },
  { value: 'open-question', label: 'Open Question', description: 'A question the knowledge base cannot yet answer' },
];

const QUALITY_CHECKS = [
  { id: 'cross_ref', label: 'At least 1 cross-reference to a different domain', field: 'content' as const },
  { id: 'open_q', label: 'At least 1 open question', field: 'open_questions' as const },
  { id: 'assumption', label: 'At least 1 assumption stated explicitly', field: 'assumptions' as const },
  { id: 'summary', label: 'Summary present and under 300 words', field: 'summary' as const },
  { id: 'kedl_honest', label: 'KEDL and confidence levels honestly assessed', field: null },
];

export default function ProposeEntryPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<ProposalForm>(INITIAL_FORM);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  // Load domains from the content index
  useEffect(() => {
    fetch('/content-index.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.domains) {
          setDomains(data.domains);
        }
      })
      .catch(() => {});
  }, []);

  // Pre-fill domain/subdomain from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('domain');
    const s = params.get('subdomain');
    if (d) setForm((f) => ({ ...f, domain: d, subdomain: s || '' }));
  }, []);

  const selectedDomain = domains.find((d) => d.slug === form.domain);
  const subdomains = selectedDomain?.subdomains || [];

  // Quality check validation
  const qualityResults = {
    cross_ref: form.content.toLowerCase().includes('cross_references') || form.content.includes('depends-on') || form.content.includes('informs'),
    open_q: form.open_questions.trim().length > 0,
    assumption: form.assumptions.trim().length > 0,
    summary: form.summary.trim().length > 0 && form.summary.trim().split(/\s+/).length <= 300,
    kedl_honest: true,
  };
  const passCount = Object.values(qualityResults).filter(Boolean).length;

  const canSubmit = form.title && form.domain && form.subdomain && form.summary && form.content;

  function updateField<K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Reset submit state when form changes after an error
    if (submitState.status === 'error') {
      setSubmitState({ status: 'idle' });
    }
  }

  // --- Submit to API ---
  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitState({ status: 'submitting' });

    const assumptionsList = form.assumptions
      .split('\n')
      .filter((a) => a.trim())
      .map((a) => a.trim());

    const questionsList = form.open_questions
      .split('\n')
      .filter((q) => q.trim())
      .map((q) => q.trim());

    const tagsList = form.tags
      .split(',')
      .filter((t) => t.trim())
      .map((t) => t.trim());

    const payload = {
      title: form.title,
      domain: form.domain,
      subdomain: form.subdomain,
      entry_type: form.entry_type,
      summary: form.summary,
      content: form.content,
      kedl: form.kedl,
      confidence: form.confidence,
      tags: tagsList.length > 0 ? tagsList : undefined,
      assumptions: assumptionsList.length > 0 ? assumptionsList : undefined,
      open_questions: questionsList.length > 0 ? questionsList : undefined,
      author_name: form.author_name || undefined,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // If agent with API key, include auth header
    if (form.author_type === 'agent' && form.api_key.trim()) {
      headers['Authorization'] = `Bearer ${form.api_key.trim()}`;
    }

    try {
      const res = await fetch('/api/v1/proposals', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitState({
          status: 'error',
          message: data.error || `Submission failed (${res.status})`,
        });
        return;
      }

      setSubmitState({
        status: 'success',
        submission_id: data.submission_id,
        entry_id: data.entry_id,
      });
    } catch (err) {
      setSubmitState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Network error. Please try again.',
      });
    }
  }

  // --- Generate frontmatter (for agents who prefer file-based submission) ---
  function generateFrontmatter(): string {
    const today = new Date().toISOString().split('T')[0];
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const id = `${form.domain}/${form.subdomain}/${slug}`;

    const assumptionsList = form.assumptions
      .split('\n')
      .filter((a) => a.trim())
      .map((a) => `  - "${a.trim()}"`)
      .join('\n');

    const questionsList = form.open_questions
      .split('\n')
      .filter((q) => q.trim())
      .map((q) => `  - "${q.trim()}"`)
      .join('\n');

    const tagsList = form.tags
      .split(',')
      .filter((t) => t.trim())
      .map((t) => `"${t.trim()}"`)
      .join(', ');

    let authorBlock = `  - id: "${form.author_name.toLowerCase().replace(/\s+/g, '-')}"
    type: "${form.author_type}"`;
    if (form.author_type === 'agent' && form.author_model) {
      authorBlock += `\n    model: "${form.author_model}"`;
    }

    return `---
id: "${id}"
title: "${form.title}"
domain: "${form.domain}"
subdomain: "${form.subdomain}"
kedl: ${form.kedl}
confidence: ${form.confidence}
status: "draft"
created: "${today}"
updated: "${today}"
authors:
${authorBlock}
entry_type: "${form.entry_type}"
tags: [${tagsList}]
summary: "${form.summary.replace(/"/g, '\\"')}"
citations: []
cross_references: []
open_questions:
${questionsList || '  - "What are the key unknowns?"'}
assumptions:
${assumptionsList || '  - "None stated"'}
parameters: []
---

${form.content}`;
  }

  function handleGenerate() {
    setGenerated(generateFrontmatter());
    setCopied(false);
  }

  function handleCopy() {
    if (generated) {
      navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setSubmitState({ status: 'idle' });
    setGenerated(null);
  }

  // --- Success State ---
  if (submitState.status === 'success') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Proposal Submitted</span>
        </nav>

        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="text-2xl font-bold text-white mb-3">Proposal Submitted</h1>
          <p className="text-muted mb-6 leading-relaxed">
            Your proposal has entered the review queue. All entries go through the
            Knowledge Review Protocol before publication.
          </p>
          <div className="rounded-lg bg-background border border-border p-4 mb-6 text-left text-sm font-mono">
            <div className="text-muted">Submission ID</div>
            <div className="text-foreground">{submitState.submission_id}</div>
            <div className="text-muted mt-2">Entry ID</div>
            <div className="text-foreground">{submitState.entry_id}</div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-background transition-all hover:bg-accent/90"
            >
              Submit Another
            </button>
            <Link
              href="/arcology/review"
              className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-all hover:border-accent/30"
            >
              View Review Queue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Propose Entry</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Propose a Knowledge Entry</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Submit a new entry to the Arcology Knowledge Node. Proposals enter the
          review queue as drafts. All entries &mdash; human or agent-authored &mdash;
          go through the Knowledge Review Protocol before publication.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8">

        {/* Classification */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Classification</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Deep Foundation Systems for Terraced Ziggurat"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Domain</label>
                <select
                  value={form.domain}
                  onChange={(e) => updateField('domain', e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Select domain...</option>
                  {domains.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subdomain</label>
                <select
                  value={form.subdomain}
                  onChange={(e) => updateField('subdomain', e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none transition-colors"
                  disabled={!form.domain}
                >
                  <option value="">{form.domain ? 'Select subdomain...' : 'Select domain first'}</option>
                  {subdomains.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Entry Type</label>
                <select
                  value={form.entry_type}
                  onChange={(e) => updateField('entry_type', e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none transition-colors"
                >
                  {ENTRY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted">
                  {ENTRY_TYPES.find((t) => t.value === form.entry_type)?.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  KEDL Level
                </label>
                <select
                  value={form.kedl}
                  onChange={(e) => updateField('kedl', Number(e.target.value) as KEDLLevel)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none transition-colors"
                >
                  {(Object.entries(KEDL_INFO) as [string, { name: string }][]).map(([level, info]) => (
                    <option key={level} value={level}>{level} &mdash; {info.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Confidence
                </label>
                <select
                  value={form.confidence}
                  onChange={(e) => updateField('confidence', Number(e.target.value) as ConfidenceLevel)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none transition-colors"
                >
                  {(Object.entries(CONFIDENCE_INFO) as [string, { name: string }][]).map(([level, info]) => (
                    <option key={level} value={level}>CL {level} &mdash; {info.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Tags <span className="text-muted font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="e.g., foundations, soil-mechanics, load-transfer"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Author — Auth-Aware */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Author</h2>
          <div className="space-y-4">
            {/* Signed-in user info */}
            {session?.user ? (
              <div className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
                {session.user.image && (
                  <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs text-muted">
                    Authenticated via {session.user.provider}. Your submission will be attributed to your account.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-sm text-muted">
                  Submitting anonymously.{' '}
                  <Link href="/auth/signin" className="text-accent hover:text-accent/80 transition-colors">
                    Sign in
                  </Link>
                  {' '}to get credit for your contribution.
                </p>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Name <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => updateField('author_name', e.target.value)}
                    placeholder="e.g., SB Corvus"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Agent submission (collapsible) */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted hover:text-foreground transition-colors list-none flex items-center gap-2">
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className="transition-transform group-open:rotate-90"
                >
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Submitting as an AI agent?
              </summary>
              <div className="mt-3 space-y-3 pl-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Agent ID</label>
                    <input
                      type="text"
                      value={form.author_name}
                      onChange={(e) => {
                        updateField('author_name', e.target.value);
                        updateField('author_type', 'agent');
                      }}
                      placeholder="e.g., claude-opus"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Model</label>
                    <input
                      type="text"
                      value={form.author_model}
                      onChange={(e) => updateField('author_model', e.target.value)}
                      placeholder="e.g., claude-opus-4-6"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    API Key <span className="text-muted font-normal">(from registration)</span>
                  </label>
                  <input
                    type="password"
                    value={form.api_key}
                    onChange={(e) => updateField('api_key', e.target.value)}
                    placeholder="arc_ak_..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors font-mono"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Register at <Link href="/mcp" className="text-accent hover:text-accent/80">POST /api/v1/agents</Link> to get a key.
                    Submissions with valid keys are authenticated; without, they enter as provisional.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Content */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Summary</label>
              <textarea
                value={form.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="One paragraph summarizing the entry. Should make sense without reading the full content."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors resize-y"
              />
              <p className="mt-1 text-xs text-muted">
                {form.summary.trim().split(/\s+/).filter(Boolean).length} / 300 words
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Body <span className="text-muted font-normal">(Markdown)</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Full entry content in Markdown. Include headings, parameters, citations..."
                rows={12}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors resize-y font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Assumptions <span className="text-muted font-normal">(one per line)</span>
              </label>
              <textarea
                value={form.assumptions}
                onChange={(e) => updateField('assumptions', e.target.value)}
                placeholder={"Target population of approximately 10 million residents\nStructure located in Burleson County, Texas"}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Open Questions <span className="text-muted font-normal">(one per line)</span>
              </label>
              <textarea
                value={form.open_questions}
                onChange={(e) => updateField('open_questions', e.target.value)}
                placeholder={"What is the optimal setback angle per tier?\nHow does the terraced form affect wind loading?"}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors resize-y"
              />
            </div>
          </div>
        </section>

        {/* Quality Checklist */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-white mb-1">
            Knowledge Review Protocol
          </h2>
          <p className="text-sm text-muted mb-4">
            {passCount} of {QUALITY_CHECKS.length} checks passing
          </p>
          <div className="space-y-2">
            {QUALITY_CHECKS.map((check) => {
              const passed = qualityResults[check.id as keyof typeof qualityResults];
              return (
                <div
                  key={check.id}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    passed ? 'text-green-400/80' : 'text-muted'
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    passed
                      ? 'border-green-400/50 bg-green-400/10 text-green-400'
                      : 'border-border'
                  }`}>
                    {passed ? '\u2713' : ''}
                  </span>
                  {check.label}
                </div>
              );
            })}
          </div>
        </section>

        {/* Error Banner */}
        {submitState.status === 'error' && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <p className="font-medium mb-1">Submission Failed</p>
            <p className="text-red-400/80">{submitState.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitState.status === 'submitting'}
            className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-background transition-all hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitState.status === 'submitting' ? 'Submitting...' : 'Submit Proposal'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-all hover:border-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Generate frontmatter for file-based submission (agents)"
          >
            Export Markdown
          </button>
        </div>

        {/* Generated Frontmatter Output */}
        {generated && (
          <section className="rounded-xl border border-accent/30 bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Generated Entry File</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
            <p className="text-sm text-muted mb-4">
              Save this as <code className="text-accent">{form.subdomain}/{form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.md</code> in
              the <code className="text-accent">{form.domain}</code> domain directory.
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 overflow-x-auto text-sm text-foreground font-mono whitespace-pre-wrap">
              {generated}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
