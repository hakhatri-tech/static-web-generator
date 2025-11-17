import React from "react";

/**
 * Renders a component instance based on type + props.
 * Keep rendering logic simple & inline so exported HTML can be derived easily.
 */
export default function ComponentRenderer({ data }) {
  const { type, props } = data;

  const commonStyle = (extra = {}) => ({
    color: props.color || "#111",
    ...extra
  });

  switch (type) {
    case "hero":
      return (
        <section style={{
          padding: props.padding || "32px",
          background: props.bg || "#eef2ff",
          textAlign: "center",
          borderRadius: 8,
          ...commonStyle()
        }}>
          <h1 style={{ margin: 0 }}>{props.title || "Hero Title"}</h1>
          <p style={{ marginTop: 8 }}>{props.subtitle || ""}</p>
        </section>
      );

    case "text":
      return (
        <p style={{ fontSize: (props.size ? `${props.size}px` : "16px"), margin: 0, ...commonStyle() }}>
          {props.text || "Sample paragraph"}
        </p>
      );

    case "card":
      return (
        <div style={{
          padding: props.padding || "12px",
          background: props.bg || "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          ...commonStyle()
        }}>
          <h4 style={{ marginTop: 0 }}>{props.title || "Card Title"}</h4>
          <div>{props.body || "Card body text"}</div>
        </div>
      );

    case "button":
      return (
        <button style={{
          padding: props.padding || "10px 14px",
          background: props.bg || "#111827",
          color: props.color || "#fff",
          border: "none",
          borderRadius: Number(props.radius || 6),
          cursor: "pointer"
        }}>
          {props.label || "Button"}
        </button>
      );

    case "image":
      return (
        <img
          src={props.src || "https://via.placeholder.com/400x200"}
          alt={props.alt || ""}
          style={{ width: "100%", borderRadius: 8 }}
        />
      );

    default:
      return <div>Unknown component: {type}</div>;
  }
}
