'use client';

import { useState } from 'react';
import type { TierRingExperience } from '@/lib/types';
import TierRingDiagram from './TierRingDiagram';
import TierDetailPanel from './TierDetailPanel';

interface Props {
  experience: TierRingExperience;
}

export default function TierExperienceShell({ experience }: Props) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showRelationships, setShowRelationships] = useState(false);

  const selectedTierData = selectedTier
    ? experience.tiers.find((t) => t.id === selectedTier) ?? null
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* Ring diagram — centered, full width */}
      <div className="w-full max-w-3xl mx-auto">
        <TierRingDiagram
          tiers={experience.tiers}
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
          theme={experience.theme}
        />
      </div>

      {/* Detail panel — below the diagram */}
      <div className="mt-8 max-w-3xl mx-auto">
        {selectedTierData ? (
          <TierDetailPanel
            key={selectedTierData.id}
            tier={selectedTierData}
            theme={experience.theme}
            onClose={() => setSelectedTier(null)}
          />
        ) : null}
      </div>

      {/* Tier Relationships section */}
      <div className="mt-16">
        <button
          onClick={() => setShowRelationships(!showRelationships)}
          className="flex items-center gap-3 group"
          aria-expanded={showRelationships}
        >
          <h2
            className="text-lg font-semibold tracking-wide"
            style={{ color: experience.theme.primary }}
          >
            Tier Relationships & Conflicts
          </h2>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform duration-200 ${showRelationships ? 'rotate-180' : ''}`}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted/50 group-hover:text-muted transition-colors"
            />
          </svg>
        </button>
        <p className="text-sm text-muted/50 mt-1 mb-4">
          The tiers are not isolated. They push against each other constantly.
        </p>

        {showRelationships && (
          <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {experience.relationships.map((rel) => {
              const fromTier = experience.tiers.find((t) => t.id === rel.from);
              const toTier = experience.tiers.find((t) => t.id === rel.to);

              return (
                <div
                  key={rel.id}
                  className="rounded-xl border border-border/20 p-5 hover:border-border/40 transition-colors"
                  style={{ backgroundColor: `${experience.theme.background}cc` }}
                >
                  {/* Tier badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {fromTier && (
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${fromTier.color}aa`,
                          color: fromTier.glowColor,
                          border: `1px solid ${fromTier.glowColor}40`,
                        }}
                      >
                        {fromTier.designation}
                      </span>
                    )}
                    <span className="text-muted/30 text-xs">↔</span>
                    {toTier && (
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${toTier.color}aa`,
                          color: toTier.glowColor,
                          border: `1px solid ${toTier.glowColor}40`,
                        }}
                      >
                        {toTier.designation}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground/80 mb-2">
                    {rel.label}
                  </h4>
                  <p className="text-xs text-foreground/50 leading-relaxed mb-3">
                    {rel.description}
                  </p>
                  <p className="text-xs text-muted/40 italic">
                    Tension: {rel.tension}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Open Questions */}
      <div className="mt-16 mb-8">
        <h2
          className="text-lg font-semibold tracking-wide mb-6"
          style={{ color: experience.theme.primary }}
        >
          Open Questions
        </h2>
        <div className="space-y-4">
          {experience.openQuestions.map((question, i) => (
            <div
              key={i}
              className="flex items-start gap-4 group"
            >
              <span
                className="text-lg font-light mt-0.5 shrink-0 w-6 text-right"
                style={{ color: `${experience.theme.accent}60` }}
              >
                {i + 1}
              </span>
              <p className="text-foreground/60 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                {question}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
