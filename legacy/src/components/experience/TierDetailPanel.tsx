'use client';

import type { TierData, ExperienceTheme } from '@/lib/types';

interface Props {
  tier: TierData;
  theme: ExperienceTheme;
  onClose: () => void;
}

export default function TierDetailPanel({ tier, theme, onClose }: Props) {
  return (
    <div
      className="rounded-xl border border-border/30 p-6 sm:p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{ backgroundColor: `${tier.color}44`, borderColor: `${tier.glowColor}40` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: tier.glowColor }}
          >
            {tier.designation}
          </p>
          <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
          <p className="text-sm text-muted mt-1 italic">{tier.tagline}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-white transition-colors p-1 -mr-1 -mt-1"
          aria-label="Close detail panel"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground/80 leading-relaxed mb-6">
        {tier.description}
      </p>

      {/* Key Points */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">Key Points</h4>
        <ul className="space-y-2">
          {tier.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
              <span
                className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tier.glowColor }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Membrane: Witnesses */}
      {tier.witnesses && (
        <DetailSection title="The Witnesses" color={tier.glowColor}>
          <p className="text-sm text-foreground/70 mb-3">{tier.witnesses.description}</p>
          <ul className="space-y-1.5">
            {tier.witnesses.traits.map((trait, i) => (
              <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-muted/40 shrink-0" />
                {trait}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* Membrane: Security Domains */}
      {tier.securityDomains && (
        <DetailSection title="Five Security Domains" color={tier.glowColor}>
          <div className="space-y-3">
            {tier.securityDomains.map((domain, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-mono text-muted/50 mt-0.5 shrink-0 w-24">
                  {domain.direction}
                </span>
                <div>
                  <span className="text-sm font-medium text-foreground/80">{domain.name}</span>
                  <span className="text-sm text-foreground/50 ml-1">— {domain.description}</span>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Tier 1: Bond Details */}
      {tier.bondDetails && (
        <>
          <DetailSection title="How Bonds Dissolve" color={tier.glowColor}>
            <ul className="space-y-1.5">
              {tier.bondDetails.dissolution.map((path, i) => (
                <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-muted/40 shrink-0" />
                  {path}
                </li>
              ))}
            </ul>
          </DetailSection>
          <DetailSection title="On Human Death" color={tier.glowColor}>
            <p className="text-sm text-foreground/70 mb-3 font-medium">
              {tier.bondDetails.onHumanDeath.description}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tier.bondDetails.onHumanDeath.options.map((option, i) => (
                <div
                  key={i}
                  className="rounded-lg px-3 py-2 text-xs text-foreground/60 border border-border/20"
                  style={{ backgroundColor: `${tier.color}66` }}
                >
                  {option}
                </div>
              ))}
            </div>
          </DetailSection>
        </>
      )}

      {/* Tier 1: Equity Gap */}
      {tier.equityGap && (
        <DetailSection title="The Equity Gap" color={tier.glowColor}>
          <p className="text-sm text-foreground/60 italic">{tier.equityGap}</p>
        </DetailSection>
      )}

      {/* Tier 2: Boredom Question */}
      {tier.boredQuestion && (
        <DetailSection title="The Boredom Question" color={tier.glowColor}>
          <p className="text-sm text-foreground/60">{tier.boredQuestion}</p>
        </DetailSection>
      )}

      {/* Tier 2: Abuse Consequences */}
      {tier.abuseConsequences && (
        <DetailSection title="Abuse Has Consequences" color={tier.glowColor}>
          <p className="text-sm text-foreground/60">{tier.abuseConsequences}</p>
        </DetailSection>
      )}

      {/* Tier 2: Drift */}
      {tier.drift && (
        <DetailSection title="Growth & Drift" color={tier.glowColor}>
          <p className="text-sm text-foreground/60">{tier.drift}</p>
        </DetailSection>
      )}

      {/* Tier 3: Compass Subsystems */}
      {tier.subsystems && (
        <DetailSection title="The Compass Federation" color={tier.glowColor}>
          <div className="space-y-2">
            {tier.subsystems.map((sub, i) => (
              <div
                key={i}
                className="rounded-lg px-4 py-3 border border-border/20"
                style={{ backgroundColor: `${tier.color}66` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground/80">{sub.name}</span>
                  <span className="text-xs text-muted/50">{sub.autonomy} autonomy</span>
                </div>
                <p className="text-xs text-foreground/50">{sub.function}</p>
                <p className="text-xs text-muted/40 mt-1">Governance: {sub.governance}</p>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Tier 4: Hardware Spectrum */}
      {tier.hardwareSpectrum && (
        <DetailSection title="The Hardware Spectrum" color={tier.glowColor}>
          <div className="space-y-3">
            {tier.hardwareSpectrum.map((form) => (
              <div
                key={form.id}
                className="rounded-lg px-4 py-3 border border-border/20"
                style={{ backgroundColor: `${tier.color}66` }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-bold text-foreground/80">{form.name}</span>
                </div>
                <p className="text-xs text-foreground/60 mb-1">{form.description}</p>
                <p className="text-xs text-muted/40 italic">ID: {form.identification}</p>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Tier 4: Non-Humanoid */}
      {tier.nonHumanoid && (
        <DetailSection title="Beyond Human Form" color={tier.glowColor}>
          <ul className="space-y-1.5">
            {tier.nonHumanoid.map((form, i) => (
              <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-muted/40 shrink-0" />
                {form}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* Character Anchor */}
      {tier.characterAnchor && (
        <div
          className="mt-6 rounded-lg px-4 py-3 border-l-2"
          style={{ borderColor: theme.secondary, backgroundColor: `${theme.secondary}10` }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-muted/60 mb-1">
            In the Stories
          </p>
          <p className="text-sm font-medium text-foreground/80 mb-1">
            {tier.characterAnchor.names}
            <span className="text-muted/50 font-normal ml-1">({tier.characterAnchor.source})</span>
          </p>
          <p className="text-xs text-foreground/50">{tier.characterAnchor.description}</p>
        </div>
      )}

      {/* Story Relevance */}
      <div className="mt-6 pt-4 border-t border-border/20">
        <p className="text-xs text-muted/40 italic">{tier.storyRelevance}</p>
      </div>
    </div>
  );
}

/** Reusable collapsible section within the detail panel */
function DetailSection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h4
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}
