import { PASTEL } from "../styles/theme";

export default function SugorokuMap({ currentNode, completedNodes, onNodeClick, mapNodes, stepTitle }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 320, borderRadius: 20, overflow: "hidden",
      background: "url(/cotomia/images/ui/map_background.png) center/cover no-repeat" }}>
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: 13, fontWeight: 600, color: PASTEL.primary }}>
        {stepTitle}
      </div>
      <svg viewBox="0 0 100 80" style={{ width: "100%", height: "100%" }}>
        {mapNodes.slice(0, -1).map((node, i) => {
          const next = mapNodes[i + 1];
          return (
            <line key={`l${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y}
              stroke={completedNodes.includes(next.id) ? PASTEL.teal : "#D5CBC0"}
              strokeWidth={completedNodes.includes(next.id) ? 0.8 : 0.5}
              strokeDasharray={completedNodes.includes(next.id) ? "none" : "1.5 1"} />
          );
        })}
        {mapNodes.map(node => {
          const isCompleted = completedNodes.includes(node.id);
          const isCurrent = currentNode === node.id;
          const isLocked = !isCompleted && !isCurrent;
          const nodeColor = node.type === "boss" ? PASTEL.accent :
            node.type === "bonus" ? PASTEL.gold :
            node.type === "start" ? PASTEL.lavender :
            isCompleted ? PASTEL.teal : isCurrent ? PASTEL.accent : "#D5CBC0";
          return (
            <g key={node.id} onClick={() => !isLocked && onNodeClick(node)}
              style={{ cursor: isLocked ? "default" : "pointer" }}>
              {isCurrent && (
                <circle cx={node.x} cy={node.y} r={4.5} fill="none"
                  stroke={PASTEL.accent} strokeWidth={0.4} opacity={0.5}>
                  <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={node.x} cy={node.y} r={3.5}
                fill={isLocked ? "#EDE5DC" : nodeColor}
                stroke={isLocked ? "#D5CBC0" : nodeColor}
                strokeWidth={0.5} />
              {isCompleted && (
                <text x={node.x} y={node.y + 1} textAnchor="middle" fontSize={3.5} fill="white">✓</text>
              )}
              {!isCompleted && !isLocked && node.type !== "start" && (
                <text x={node.x} y={node.y + 1} textAnchor="middle" fontSize={2.5} fill="white" fontWeight="bold">
                  {node.type === "bonus" ? "!" : node.type === "boss" ? "⚡" : "?"}
                </text>
              )}
              <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize={2.2}
                fill={isLocked ? "#C5BBB0" : PASTEL.text} fontWeight={isCurrent ? "bold" : "normal"}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
