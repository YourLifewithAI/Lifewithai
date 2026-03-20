'use client';

import { useState } from 'react';
import type { StoryExperience } from '@/lib/types';
import SystemDiagram from './SystemDiagram';
import TimeScaleSelector from './TimeScaleSelector';
import AILayerToggle from './AILayerToggle';
import NodeDetailPanel from './NodeDetailPanel';
import MetricsBar from './MetricsBar';

interface Props {
  experience: StoryExperience;
}

export default function ExperienceShell({ experience }: Props) {
  const [activeTimeScale, setActiveTimeScale] = useState(experience.timeScales[0].id);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showAILayer, setShowAILayer] = useState(false);

  const currentTimeScale = experience.timeScales.find((t) => t.id === activeTimeScale)!;
  const selectedNodeData = selectedNode
    ? experience.nodes.find((n) => n.id === selectedNode) ?? null
    : null;

  // Filter metrics for current time scale
  const activeMetrics = experience.metrics.filter((m) =>
    currentTimeScale.metrics.includes(m.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <TimeScaleSelector
          timeScales={experience.timeScales}
          active={activeTimeScale}
          onChange={setActiveTimeScale}
          theme={experience.theme}
        />
        <AILayerToggle
          active={showAILayer}
          onChange={setShowAILayer}
          theme={experience.theme}
        />
      </div>

      {/* Time scale description */}
      <p className="text-sm text-muted mb-6 max-w-2xl">
        <span className="font-medium text-foreground">{currentTimeScale.duration}</span>
        {' — '}
        {currentTimeScale.description}
      </p>

      {/* Diagram */}
      <div className="relative">
        <SystemDiagram
          nodes={experience.nodes}
          flows={experience.flows}
          activeTimeScale={activeTimeScale}
          activeFlows={currentTimeScale.activeFlows}
          activeNodes={currentTimeScale.activeNodes}
          showAILayer={showAILayer}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          theme={experience.theme}
        />

        {/* Node detail panel */}
        {selectedNodeData && (
          <NodeDetailPanel
            node={selectedNodeData}
            showAILayer={showAILayer}
            onClose={() => setSelectedNode(null)}
            theme={experience.theme}
          />
        )}
      </div>

      {/* Metrics */}
      <MetricsBar metrics={activeMetrics} theme={experience.theme} />
    </div>
  );
}
