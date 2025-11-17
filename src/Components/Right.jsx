import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateComponent, deleteComponent, clearPage } from "../store/builderSlice";


export default function Right() {
  const dispatch = useDispatch();
  const comps = useSelector((s) => s.builder.componentsOnPage);
  const selectedId = useSelector((s) => s.builder.selectedId);
  const selected = comps.find((c) => c.id === selectedId);

  function onChange(key, value) {
    if (!selected) return;
    dispatch(updateComponent({ id: selected.id, props: { [key]: value } }));
  }

  function renderEditors() {
    if (!selected) return <div>Select a component to edit</div>;

    const p = selected.props || {};

    // Basic editors: vary by type
    if (selected.type === "hero") {
      return (
        <>
          <div className="label">Title</div>
          <input className="input" value={p.title || ""} onChange={(e) => onChange("title", e.target.value)} />

          <div className="label">Subtitle</div>
          <input className="input" value={p.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} />

          <div className="label">Background (hex)</div>
          <input className="color" type="color" value={p.bg || "#eef2ff"} onChange={(e) => onChange("bg", e.target.value)} />

          <div className="label">Text color</div>
          <input className="color" type="color" value={p.color || "#0f172a"} onChange={(e) => onChange("color", e.target.value)} />

          <div className="label">Padding (e.g. 40px)</div>
          <input className="input" value={p.padding || ""} onChange={(e) => onChange("padding", e.target.value)} />
        </>
      );
    }

    if (selected.type === "text") {
      return (
        <>
          <div className="label">Text</div>
          <textarea className="input" rows={4} value={p.text || ""} onChange={(e) => onChange("text", e.target.value)} />

          <div className="label">Font size (px)</div>
          <input className="input" value={p.size || ""} onChange={(e) => onChange("size", e.target.value)} />

          <div className="label">Color</div>
          <input className="color" type="color" value={p.color || "#111"} onChange={(e) => onChange("color", e.target.value)} />
        </>
      );
    }

    if (selected.type === "card") {
      return (
        <>
          <div className="label">Title</div>
          <input className="input" value={p.title || ""} onChange={(e) => onChange("title", e.target.value)} />
          <div className="label">Body</div>
          <textarea className="input" rows={3} value={p.body || ""} onChange={(e) => onChange("body", e.target.value)} />
          <div className="label">Background</div>
          <input className="color" type="color" value={p.bg || "#ffffff"} onChange={(e) => onChange("bg", e.target.value)} />
        </>
      );
    }

    if (selected.type === "button") {
      return (
        <>
          <div className="label">Label</div>
          <input className="input" value={p.label || ""} onChange={(e) => onChange("label", e.target.value)} />
          <div className="label">Background</div>
          <input className="color" type="color" value={p.bg || "#111827"} onChange={(e) => onChange("bg", e.target.value)} />
          <div className="label">Text color</div>
          <input className="color" type="color" value={p.color || "#ffffff"} onChange={(e) => onChange("color", e.target.value)} />
          <div className="label">Padding</div>
          <input className="input" value={p.padding || ""} onChange={(e) => onChange("padding", e.target.value)} />
        </>
      );
    }

    if (selected.type === "image") {
      return (
        <>
          <div className="label">Image URL</div>
          <input className="input" value={p.src || ""} onChange={(e) => onChange("src", e.target.value)} />
          <div className="label">Alt text</div>
          <input className="input" value={p.alt || ""} onChange={(e) => onChange("alt", e.target.value)} />
        </>
      );
    }

    return <div>No editors for this component</div>;
  }

  return (
    <aside className="right">
      <h3>Inspector</h3>

      {selected ? (
        <>
          <div className="label">Editing: {selected.type} (ID {selected.id})</div>
          {renderEditors()}

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => dispatch(updateComponent({ id: selected.id, props: { ...(selected.props || {}) } }))}>Apply</button>
            <button className="btn" style={{ marginLeft: 8, background: "#ef4444", color: "white" }} onClick={() => dispatch(deleteComponent(selected.id))}>Delete</button>
          </div>
        </>
      ) : (
        <>
          <div className="label">No selection</div>
          <div className="hint">Click an item in center to select it.</div>

          <div style={{ marginTop: 20 }}>
            <button className="btn" onClick={() => dispatch(clearPage())}>Clear Page</button>
          </div>
        </>
      )}
    </aside>
  );
}
