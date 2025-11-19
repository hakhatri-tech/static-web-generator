// src/components/ComponentRenderer.jsx
import React from "react";

/**
 * Renders a component WITH its children inside the DOM element.
 * This is REQUIRED for flex/grid/container layouts to work.
 */

function styleObj(styles = {}) {
  const s = { ...styles };

  // support backgroundImageUrl stored in styles
  if (s.backgroundImageUrl) {
    s.backgroundImage = `url(${s.backgroundImageUrl})`;
    s.backgroundSize = s.backgroundSize || "cover";
    s.backgroundRepeat = s.backgroundRepeat || "no-repeat";
    s.backgroundPosition = s.backgroundPosition || "center";
  }

  // convert numeric styles to px
  const numericKeys = ["fontSize", "borderRadius", "gap", "width", "height", "padding", "margin", "lineHeight"];
  numericKeys.forEach((key) => {
    if (typeof s[key] === "number") s[key] = `${s[key]}px`;
  });

  return s;
}

// ----------------------------------------------
// ⭐ NEW: Tag mapper — makes rendering children easy
// ----------------------------------------------
function getTag(type) {
  switch (type) {
    case "heading":
      return "h2";
    case "text":
      return "p";
    case "span":
      return "span";
    case "strong":
      return "strong";
    case "em":
      return "em";
    case "ul":
      return "ul";
    case "li":
      return "li";
    case "image":
      return "img";
    case "video":
      return "video";
    case "iframe":
      return "iframe";
    case "input":
      return "input";
    case "textarea":
      return "textarea";
    case "checkbox":
      return "input";
    case "button":
      return "button";
    case "card":
    case "section":
    case "div":
    case "grid":
    case "container":
    case "main":
    case "footer":
    case "header":
    case "aside":
    case "article":
      return "div";
    case "form":
      return "form";
    case "table":
      return "table";
    case "svg":
      return "svg";
    case "hr":
      return "hr";
    default:
      return "div";
  }
}

export default function ComponentRenderer({ comp, children }) {
  if (!comp) return null;

  const Tag = getTag(comp.type);
  const styles = styleObj(comp.styles || {});
  const props = comp.props || {};

  // Special handling for IMG, VIDEO, INPUT, IFRAME, CHECKBOX
  if (Tag === "img") return <img style={styles} {...props} alt={props.alt || ""} />;
  if (Tag === "video") return <video style={styles} controls {...props} />;
  if (Tag === "input") return <input style={styles} {...props} />;
  if (Tag === "iframe") return <iframe style={styles} {...props} title={props.title || "embed"} />;

  // NAVBAR special layout
  // NAVBAR fixed — DO NOT render children here
if (comp.type === "navbar" || comp.type === "nav") {
  return (
    <nav style={styles}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{comp.children?.[0]?.content || "Brand"}</div>
        <div style={{ display: "flex", gap: 12 }}>
          {(comp.children?.[1]?.children || []).map((c) => (
            <span key={c.id} style={c.styles || {}}>
              {c.content}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}


  // DEFAULT COMPONENT RENDERING WITH CHILDREN
  return (
    <Tag style={styles} {...props}>
      {/* Component's own text */}
      {comp.content}

      {/* CHILDREN MUST BE INSIDE HERE (fixes layout issues) */}
      {children}
    </Tag>
  );
}
