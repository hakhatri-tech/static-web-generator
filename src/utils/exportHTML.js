/**
 * Creates a single-file HTML string from components array.
 * Basic inline styles only. Escapes text content.
 */
function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function exportToHTML(components) {
  let body = "";

  components.forEach((c) => {
    const p = c.props || {};
    switch (c.type) {
      case "hero":
        body += `<section style="padding:${escapeHtml(p.padding||"32px")};background:${escapeHtml(p.bg||"#eef2ff")};text-align:center;border-radius:8px;">
          <h1 style="margin:0;color:${escapeHtml(p.color||"#111")}">${escapeHtml(p.title||"Hero Title")}</h1>
          <p style="margin-top:8px;color:${escapeHtml(p.color||"#111")}">${escapeHtml(p.subtitle||"")}</p>
        </section>`;
        break;

      case "text":
        body += `<p style="font-size:${escapeHtml(p.size||"16")}px;color:${escapeHtml(p.color||"#111")}">${escapeHtml(p.text||"")}</p>`;
        break;

      case "card":
        body += `<div style="padding:${escapeHtml(p.padding||"12px")};background:${escapeHtml(p.bg||"#fff")};border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
          <h4 style="margin-top:0;color:${escapeHtml(p.color||"#111")}">${escapeHtml(p.title||"Card Title")}</h4>
          <div style="color:${escapeHtml(p.color||"#111")}">${escapeHtml(p.body||"")}</div>
        </div>`;
        break;

      case "button":
        body += `<button style="padding:${escapeHtml(p.padding||"10px 14px")};background:${escapeHtml(p.bg||"#111")};color:${escapeHtml(p.color||"#fff")};border:none;border-radius:${escapeHtml(p.radius||"6")}px;">${escapeHtml(p.label||"Button")}</button>`;
        break;

      case "image":
        body += `<img src="${escapeHtml(p.src||"")}" alt="${escapeHtml(p.alt||"")}" style="max-width:100%;border-radius:8px;">`;
        break;

      default:
        body += `<div>Unknown component: ${escapeHtml(c.type)}</div>`;
    }

    body += "\n";
  });

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Exported Page</title>
  <style>
    body{font-family:Inter,Arial,sans-serif;padding:20px;max-width:1100px;margin:0 auto}
  </style>
</head>
<body>
  ${body}
</body>
</html>`;

  return html;
}
