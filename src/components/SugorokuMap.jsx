import { PASTEL } from "../styles/theme";

export default function SugorokuMap({ currentNode, completedNodes, onNodeClick, mapNodes, stepTitle }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 320, borderRadius: 20, overflow: "hidden",
      background: "url(/cotomia/images/ui/map_background.png) center/cover no-repeat" }}>
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: 13, fontWeight: 600, color: PASTEL.primary }}>
        {stepTitle}
      </div>
      <svg viewBox="0 0 100 80" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
        {mapNodes.slice(0, -1).map((node, i) => {
          const next = mapNodes[i + 1];
          return (
            <line key={`l${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y}
              stroke={completedNodes.includes(next.id) ? PASTEL.teal : "#D5CBC0"}
              strokeWidth={completedNodes.includes(next.id) ? 0.8 : 0.5}
              strokeDasharray={completedNodes.includes(next.id) ? "none" : "1.5 1"} />
          );
        })}
      </svg>
      {mapNodes.map(node => {
        const isCompleted = completedNodes.includes(node.id);
        const isCurrent = currentNode === node.id;
        const isClickable = !(!isCompleted && !isCurrent);
        const isBoss = node.type === "boss";
        const isBonus = node.type === "bonus";
        return (
          <div key={node.id} onClick={() => isClickable && onNodeClick(node)}
            style={{
              position: "absolute", left: `${node.x}%`, top: `${node.y}%`,
              width: 48, height: 48, borderRadius: 24, transform: "translate(-50%, -50%)",
              background: isCompleted ? (isBoss ? PASTEL.gold : PASTEL.teal)
                          : isCurrent ? (isBoss ? PASTEL.error : PASTEL.accent)
                          : "#ffffff",
              border: isCurrent ? "4px solid #fff" : isCompleted ? "none" : `2px solid ${PASTEL.border}60`,
              boxShadow: isCurrent ? `0 0 0 4px ${PASTEL.accent}66, 0 8px 16px rgba(0,0,0,0.2)`
                         : isCompleted ? "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.15)"
                         : "0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(0,0,0,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: (isCompleted || isCurrent) ? "#fff" : PASTEL.text,
              fontSize: isBoss ? 20 : 18, fontWeight: 800,
              cursor: isClickable ? "pointer" : "default",
              opacity: (isCompleted || isCurrent) ? 1 : 0.9,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: isCurrent ? 10 : 1,
            }}>
            {isCompleted ? "✓" : isBonus ? "!" : isBoss ? "⚡" : "?"}
          </div>
        );
      })}
    </div>
  );
}
