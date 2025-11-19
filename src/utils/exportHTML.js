// src/utils/exportHTML.js
function kebabCase(str = "") {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function styleObjectToCssString(style = {}) {
  const parts = [];
  for (const key in style) {
    if (style[key] == null) continue;
    let val = style[key];
    if (typeof val === "number") {
      if (val !== 0 && !["opacity", "zIndex", "fontWeight", "lineHeight"].includes(key)) val = `${val}px`;
    }
    if (key === "backgroundImageUrl") {
      parts.push(`background-image: url(${val});`);
      continue;
    }
    parts.push(`${kebabCase(key)}: ${val};`);
  }
  return parts.join(" ");
}
function escapeHtml(text) {
  if (text == null) return "";
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function renderNode(node) {
  if (!node) return "";
  const styleString = styleObjectToCssString(node.styles || {});
  const dataAttrs = node.styles && node.styles.display === "grid" ? 'data-grid="true"' : "";
  const attrs = `${dataAttrs} data-id="${escapeHtml(node.id)}" style="${escapeHtml(styleString)}"`;
  switch (node.type) {
    case "root":
      return (node.children || []).map(renderNode).join("\n");
    case "text":
      return `<p ${attrs}>${escapeHtml(node.content || "")}</p>`;
    case "heading":
      return `<h2 ${attrs}>${escapeHtml(node.content || "")}</h2>`;
    case "button":
      return `<button ${attrs}>${escapeHtml(node.content || "Button")}</button>`;
    case "image": {
      const src = escapeHtml((node.props && node.props.src) || "");
      return `<img ${attrs} src="${src}" alt="" />`;
    }
    case "div":
    case "card":
    case "section": {
      const children = (node.children || []).map(renderNode).join("\n");
      const tag = node.type === "section" ? "section" : "div";
      return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    default:
      return `<div ${attrs}>${escapeHtml(node.content || node.type)}</div>`;
  }
}
export function exportRootAsHtml(root, options = {}) {
  const title = options.title || "Exported Page";
  const fileName = options.fileName || "page.html";
  const body = renderNode(root);
  const css = `
    html,body{margin:0;padding:0;font-family:Inter,system-ui,Arial,sans-serif;color:#111;}
    .site-container{max-width:1200px;margin:0 auto;padding:20px;}
    img{max-width:100%;height:auto;display:block;}
    @media (max-width: 768px) {
      [data-grid="true"]{grid-template-columns: 1fr !important;}
      [data-id="hero-left"], [data-id="hero-right"]{width:100% !important; min-width:0 !important;}
      section { padding-left:16px !important; padding-right:16px !important; }
    }
  `;
  const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>${css}</style></head><body><div class="site-container">${body}</div></body></html>`;
  const blob = new Blob([doc], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
export default exportRootAsHtml;
