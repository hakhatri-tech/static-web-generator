import React from "react";
import { useDispatch } from "react-redux";
import { addComponent } from "../store/builderSlice";

/**
 * Left panel: dragable component templates and quick-add buttons
 */
const TEMPLATES = [
  { type: "hero", name: "Hero Section", props: { title: "Hero Title", subtitle: "Subtext", padding: "40px", bg: "#eef2ff", color: "#0f172a" } },
  { type: "text", name: "Text Block", props: { text: "Some paragraph text...", size: "16", color: "#111" } },
  { type: "card", name: "Card", props: { title: "Card Title", body: "Card body text", padding: "16px", bg: "#fff" } },
  { type: "button", name: "Button", props: { label: "Click me", padding: "10px 18px", bg: "#111827", color: "#fff", radius: "6" } },
  { type: "image", name: "Image", props: { src: "https://via.placeholder.com/600x300", alt: "Placeholder" } }
];

export default function Left() {
  const dispatch = useDispatch();

  function onDragStart(e, t) {
    e.dataTransfer.setData("componentType", JSON.stringify(t));
  }

  function quickAdd(t) {
    dispatch(addComponent({ type: t.type, props: t.props }));
  }

  return (
    <aside className="left">
      <h4>Components</h4>

      {TEMPLATES.map((t) => (
        <div
          key={t.type}
          className="component-card"
          draggable
          onDragStart={(e) => onDragStart(e, t)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{t.name}</strong>
              <div className="hint">{t.type}</div>
            </div>
            <button className="btn small" onClick={() => quickAdd(t)}>Add</button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 14 }}>
        <div className="label">Tips</div>
        <div className="hint">Drag a template into the center preview or click Add.</div>
      </div>
    </aside>
  );
}
