// src/components/CustomDragLayer.jsx
import React from "react";
import { useDragLayer } from "react-dnd";
import ComponentRenderer from "./ComponentRenderer";

export default function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset || !item) return null;
  const { x, y } = currentOffset;

  const previewStyle = {
    position: "fixed",
    pointerEvents: "none",
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
    opacity: 0.9,
    zIndex: 9999,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    borderRadius: 8,
    background: "#fff",
    padding: 8,
    maxWidth: 380,
  };

  const previewComp = item.previewComponent || { type: item.newType || item.node?.type || "div", styles: { padding: "8px" }, content: item.previewText || item.node?.content };

  return (
    <div style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none", zIndex: 9999 }}>
      <div style={previewStyle}>
        <ComponentRenderer comp={previewComp} />
      </div>
    </div>
  );
}
