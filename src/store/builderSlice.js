// src/store/builderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const MAX_HISTORY = 50;
export const CONTAINER_TYPES = new Set(["root", "div", "section", "card", "nav", "grid"]);

// replace the existing createBaseComponent(...) function with this

function createBaseComponent(type) {
  const id = nanoid();
  const base = {
    id,
    type,
    props: {},
    styles: {
      padding: "0px",
      margin: "0px",
      background: "transparent",
      color: "#111827",
      fontSize: "16px",
      border: "none",
      borderRadius: "0px",
      display: "block",
    },
    children: [],
    content: type === "text" ? "Editable text" : undefined,
    meta: {},
  };

  // helper to create simple text children
  function txt(content, extra = {}) {
    return {
      id: nanoid(),
      type: "text",
      content,
      styles: { margin: "0", ...extra },
      children: [],
    };
  }

  function heading(content, size = "32px", extra = {}) {
    return {
      id: nanoid(),
      type: "heading",
      content,
      styles: { fontSize: size, fontWeight: "700", margin: "0", ...extra },
      children: [],
    };
  }

  switch (type) {
    // primitives
    case "text":
      base.content = "Editable paragraph text";
      base.styles.fontSize = "16px";
      return base;

    case "heading":
      base.content = "Heading";
      base.styles.fontSize = "28px";
      base.styles.fontWeight = "700";
      return base;

    case "image":
      base.props.src = "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&q=60&auto=format&fit=crop";
      base.props.alt = "image";
      base.styles.width = "100%";
      base.styles.borderRadius = "8px";
      base.styles.display = "block";
      return base;

    case "button":
      base.content = "Learn more";
      base.styles.display = "inline-block";
      base.styles.padding = "10px 18px";
      base.styles.background = "#2563eb";
      base.styles.color = "#fff";
      base.styles.borderRadius = "8px";
      base.styles.border = "none";
      return base;

    case "card":
      base.type = "card";
      base.styles.padding = "18px";
      base.styles.border = "1px solid #e6edf3";
      base.styles.borderRadius = "10px";
      base.styles.background = "#ffffff";
      base.children = [
        heading("Card title", "20px"),
        txt("Short supporting description text.", { color: "#475569", fontSize: "14px", marginTop: "8px" }),
        { id: nanoid(), type: "button", content: "Action", styles: { marginTop: "12px" }, children: [] },
      ];
      return base;

    // layout helpers
    case "container":
    case "div":
      base.type = "div";
      base.styles.padding = "8px";
      base.styles.display = "block";
      return base;

    case "section":
      base.type = "section";
      base.styles.padding = "48px 20px";
      base.styles.background = "transparent";
      base.styles.display = "block";
      return base;

    case "grid":
      base.styles.display = "grid";
      base.styles.gridTemplateColumns = "repeat(3,1fr)";
      base.styles.gap = "20px";
      base.children = [
        createBaseComponent("card"),
        createBaseComponent("card"),
        createBaseComponent("card"),
      ];
      return base;

    case "flexRow":
      base.type = "div";
      base.styles.display = "flex";
      base.styles.flexDirection = "row";
      base.styles.gap = "16px";
      base.children = [createBaseComponent("div"), createBaseComponent("div")];
      return base;

    case "flexCol":
      base.type = "div";
      base.styles.display = "flex";
      base.styles.flexDirection = "column";
      base.styles.gap = "12px";
      base.children = [createBaseComponent("text"), createBaseComponent("button")];
      return base;

    // PREBUILT BLOCKS (Minimal Modern style)
    case "navbar":
      base.type = "nav";
      base.styles.display = "flex";
      base.styles.justifyContent = "space-between";
      base.styles.alignItems = "center";
      base.styles.padding = "12px 20px";
      base.styles.background = "#ffffff";
      base.styles.borderBottom = "1px solid #eef2f6";
      base.children = [
        { id: nanoid(), type: "text", content: "Your Brand", styles: { fontWeight: "700", fontSize: "18px" }, children: [] },
        {
          id: nanoid(),
          type: "div",
          styles: { display: "flex", gap: "12px", alignItems: "center" },
          children: [
            { id: nanoid(), type: "text", content: "Home", styles: { cursor: "pointer" }, children: [] },
            { id: nanoid(), type: "text", content: "Features", styles: { cursor: "pointer" }, children: [] },
            { id: nanoid(), type: "text", content: "Pricing", styles: { cursor: "pointer" }, children: [] },
            { id: nanoid(), type: "button", content: "Get Started", styles: { padding: "8px 12px", borderRadius: "8px", background: "#2563eb", color: "#fff" }, children: [] },
          ],
        },
      ];
      return base;

    case "hero":
    case "hero-section":
    case "heroBlock":
      base.type = "section";
      base.styles.display = "flex";
      base.styles.alignItems = "center";
      base.styles.justifyContent = "space-between";
      base.styles.flexWrap = "wrap";
      base.styles.padding = "64px 20px";
      base.styles.gap = "32px";
      base.children = [
        {
          id: nanoid(),
          type: "div",
          styles: { flex: "1 1 420px", minWidth: "260px" },
          children: [
            heading("Build Beautiful Websites Effortlessly", "40px", { color: "#0f172a" }),
            txt("A powerful, minimal builder to prototype quickly and ship responsive pages.", { color: "#475569", fontSize: "16px", marginTop: "12px" }),
            {
              id: nanoid(),
              type: "div",
              styles: { marginTop: "20px", display: "flex", gap: "12px" },
              children: [
                { id: nanoid(), type: "button", content: "Get Started", styles: { background: "#2563eb", color: "#fff", padding: "12px 20px", borderRadius: "8px", border: "none" }, children: [] },
                { id: nanoid(), type: "button", content: "Live Demo", styles: { background: "transparent", color: "#2563eb", padding: "12px 20px", borderRadius: "8px", border: "1px solid #e6eef8" }, children: [] },
              ],
            },
          ],
        },
        {
          id: nanoid(),
          type: "image",
          props: { src: "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&q=60&auto=format&fit=crop" },
          styles: { flex: "0 1 420px", width: "46%", minWidth: "260px", borderRadius: "12px", boxShadow: "0 12px 30px rgba(2,6,23,0.08)" },
          children: [],
        },
      ];
      return base;

    case "featureGrid":
    case "feature-grid":
    case "featureGridBlock":
      base.type = "section";
      base.styles.display = "grid";
      base.styles.gridTemplateColumns = "repeat(3,1fr)";
      base.styles.gap = "20px";
      base.styles.padding = "48px 20px";
      base.children = [
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2f6" },
          children: [heading("Fast", "18px"), txt("Build quickly with prebuilt blocks.", { color: "#475569" })],
        },
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2f6" },
          children: [heading("Responsive", "18px"), txt("Layouts adapt to screens automatically.", { color: "#475569" })],
        },
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2f6" },
          children: [heading("Customizable", "18px"), txt("Change styles visually.", { color: "#475569" })],
        },
      ];
      return base;

    case "testimonials":
    case "testimonial":
      base.type = "section";
      base.styles.display = "flex";
      base.styles.gap = "20px";
      base.styles.padding = "40px 20px";
      base.children = [
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2f6", flex: "1" },
          children: [txt("“This builder changed how I design.”", { fontSize: "18px", marginBottom: "12px" }), txt("— Alex R", { color: "#475569" })],
        },
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2f6", flex: "1" },
          children: [txt("“Ship prototypes quickly.”", { fontSize: "18px", marginBottom: "12px" }), txt("— Sam K", { color: "#475569" })],
        },
      ];
      return base;

    case "cta":
    case "call-to-action":
      base.type = "section";
      base.styles.padding = "40px 20px";
      base.styles.textAlign = "center";
      base.styles.borderRadius = "8px";
      base.styles.background = "linear-gradient(90deg,#eef2ff,#e6f0ff)";
      base.children = [
        heading("Ready to get started?", "28px"),
        { id: nanoid(), type: "button", content: "Start Free Trial", styles: { marginTop: "16px", padding: "12px 22px", background: "#2563eb", color: "#fff", borderRadius: "8px" }, children: [] },
      ];
      return base;

    case "footer":
      base.type = "footer";
      base.styles.padding = "28px 20px";
      base.styles.textAlign = "center";
      base.children = [txt("© " + new Date().getFullYear() + " Your Brand. All rights reserved.", { color: "#6b7280" })];
      return base;

    case "pricing":
    case "pricingTable":
      base.type = "section";
      base.styles.display = "grid";
      base.styles.gridTemplateColumns = "repeat(3,1fr)";
      base.styles.gap = "18px";
      base.styles.padding = "48px 20px";
      base.children = [
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "18px", borderRadius: "10px", border: "1px solid #eef2f6", textAlign: "center" },
          children: [heading("Basic", "20px"), txt("$9/mo", { fontSize: "22px", fontWeight: "700", marginTop: "8px" }), { id: nanoid(), type: "button", content: "Buy", styles: { marginTop: "12px" }, children: [] }],
        },
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "22px", borderRadius: "10px", border: "1px solid #eef2f6", background: "#ffffff", textAlign: "center" },
          children: [heading("Pro", "20px"), txt("$29/mo", { fontSize: "22px", fontWeight: "700", marginTop: "8px" }), { id: nanoid(), type: "button", content: "Buy", styles: { marginTop: "12px", background: "#2563eb", color: "#fff" }, children: [] }],
        },
        {
          id: nanoid(),
          type: "card",
          styles: { padding: "18px", borderRadius: "10px", border: "1px solid #eef2f6", textAlign: "center" },
          children: [heading("Enterprise", "20px"), txt("Custom pricing", { fontSize: "18px", marginTop: "8px" }), { id: nanoid(), type: "button", content: "Contact", styles: { marginTop: "12px" }, children: [] }],
        },
      ];
      return base;

    case "faq":
    case "accordion":
      base.type = "section";
      base.styles.padding = "32px 20px";
      base.children = [
        {
          id: nanoid(),
          type: "div",
          styles: { marginBottom: "12px" },
          children: [heading("How does it work?", "18px"), txt("You drag blocks, edit content, then export HTML.", { color: "#475569" })],
        },
        {
          id: nanoid(),
          type: "div",
          children: [heading("Is it responsive?", "18px"), txt("Yes — blocks are responsive by default.", { color: "#475569" })],
        },
      ];
      return base;

    case "twoCol":
    case "two-column":
      base.type = "div";
      base.styles.display = "flex";
      base.styles.gap = "24px";
      base.styles.flexWrap = "wrap";
      base.children = [
        {
          id: nanoid(),
          type: "div",
          styles: { flex: "1 1 320px" },
          children: [heading("Left column", "20px"), txt("Content goes here", { color: "#475569", marginTop: "8px" })],
        },
        {
          id: nanoid(),
          type: "div",
          styles: { flex: "1 1 320px" },
          children: [heading("Right column", "20px"), txt("More content here", { color: "#475569", marginTop: "8px" })],
        },
      ];
      return base;

    case "cardBlock":
      base.type = "div";
      base.styles.display = "grid";
      base.styles.gridTemplateColumns = "repeat(3,1fr)";
      base.styles.gap = "18px";
      base.children = [createBaseComponent("card"), createBaseComponent("card"), createBaseComponent("card")];
      return base;

    // form elements (simple placeholders)
    case "input":
      base.type = "input";
      base.props.placeholder = "Enter text";
      base.styles.padding = "10px";
      base.styles.border = "1px solid #e6eef3";
      base.styles.borderRadius = "8px";
      return base;

    case "textarea":
      base.type = "textarea";
      base.props.placeholder = "Type message";
      base.styles.padding = "10px";
      base.styles.border = "1px solid #e6eef3";
      base.styles.borderRadius = "8px";
      return base;

    default:
      // fallback: simple container with label (helps identifying in canvas)
      base.children = [txt(type.charAt(0).toUpperCase() + type.slice(1))];
      return base;
  }
}

// default responsive landing template
const TEMPLATE = [
  {
    id: "hero-section",
    type: "section",
    styles: {
      padding: "60px 20px",
      background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
      display: "flex",
      gap: "40px",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "12px",
      flexWrap: "wrap",
    },
    children: [
      {
        id: "hero-left",
        type: "div",
        styles: { width: "50%", minWidth: "280px", display: "flex", flexDirection: "column", gap: "20px" },
        children: [
          {
            id: "hero-title",
            type: "heading",
            content: "Build Beautiful Websites Effortlessly",
            styles: {
              fontSize: "40px",
              fontWeight: "700",
              color: "#0f172a",
              lineHeight: "1.1",
              margin: "0",
            },
          },
          {
            id: "hero-subtitle",
            type: "text",
            content: "A powerful and intuitive drag-and-drop builder to create clean, responsive layouts in minutes.",
            styles: { fontSize: "18px", color: "#475569", lineHeight: "1.5", margin: "0" },
          },
          {
            id: "hero-btn",
            type: "button",
            content: "Get Started",
            styles: {
              background: "#4f46e5",
              color: "white",
              padding: "14px 26px",
              borderRadius: "10px",
              fontSize: "16px",
              width: "fit-content",
              border: "none",
            },
          },
        ],
      },
      {
        id: "hero-right",
        type: "image",
        props: { src: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=900&q=80&auto=format&fit=crop" },
        styles: {
          width: "46%",
          minWidth: "260px",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        },
      },
    ],
  },

  {
    id: "features-section",
    type: "section",
    styles: {
      padding: "60px 20px",
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "30px",
      alignItems: "stretch",
    },
    children: [
      {
        id: "f1",
        type: "card",
        styles: {
          padding: "20px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "white",
        },
        children: [
          { id: "f1-title", type: "heading", content: "Drag & Drop", styles: { fontSize: "22px", fontWeight: "600", margin: "0 0 10px 0" } },
          { id: "f1-desc", type: "text", content: "Easily rearrange components with pixel-perfect precision.", styles: { fontSize: "16px", color: "#475569" } },
        ],
      },
      {
        id: "f2",
        type: "card",
        styles: {
          padding: "20px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "white",
        },
        children: [
          { id: "f2-title", type: "heading", content: "Responsive by Default", styles: { fontSize: "22px", fontWeight: "600", margin: "0 0 10px 0" } },
          { id: "f2-desc", type: "text", content: "All layouts adapt beautifully to mobile, tablet, and desktop.", styles: { fontSize: "16px", color: "#475569" } },
        ],
      },
      {
        id: "f3",
        type: "card",
        styles: {
          padding: "20px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "white",
        },
        children: [
          { id: "f3-title", type: "heading", content: "Editable Everything", styles: { fontSize: "22px", fontWeight: "600", margin: "0 0 10px 0" } },
          { id: "f3-desc", type: "text", content: "Text, images, spacing, colors, backgrounds — fully editable.", styles: { fontSize: "16px", color: "#475569" } },
        ],
      },
    ],
  },

  {
    id: "cta-section",
    type: "section",
    styles: {
      padding: "50px 20px",
      background: "linear-gradient(135deg,#4f46e5,#6366f1)",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    },
    children: [
      { id: "cta-title", type: "heading", content: "Start Creating Today", styles: { fontSize: "32px", fontWeight: "700", margin: "0 0 20px 0", color: "white" } },
      { id: "cta-btn", type: "button", content: "Try It Now", styles: { background: "white", color: "#4f46e5", padding: "14px 26px", borderRadius: "10px", border: "none" } },
    ],
  },

  {
    id: "footer-section",
    type: "section",
    styles: { padding: "24px 20px", textAlign: "center", color: "#475569", fontSize: "14px" },
    children: [{ id: "footer-text", type: "text", content: "© 2025 Your Brand. All rights reserved." }],
  },
];

const initialState = {
  root: { id: "root", type: "root", children: TEMPLATE },
  selectedId: null,
  dragging: null,
  history: [],
  future: [],
};

function cloneState(s) {
  return JSON.parse(JSON.stringify(s));
}

function pushHistory(state) {
  const snapshot = cloneState({ root: state.root, selectedId: state.selectedId });
  state.history = [...state.history, snapshot].slice(-MAX_HISTORY);
  state.future = [];
}

function findNodeAndParent(node, id, parent = null) {
  if (!node) return null;
  if (node.id === id) return { node, parent };
  for (const child of node.children || []) {
    const res = findNodeAndParent(child, id, node);
    if (res) return res;
  }
  return null;
}

function insertNodeAt(node, targetId, newNode, position = null) {
  if (node.id === targetId) {
    if (!CONTAINER_TYPES.has(node.type)) return false;
    node.children = node.children || [];
    if (position === null || position >= node.children.length) node.children.push(newNode);
    else node.children.splice(position, 0, newNode);
    return true;
  }
  for (const child of node.children || []) {
    if (insertNodeAt(child, targetId, newNode, position)) return true;
  }
  return false;
}

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addComponent(state, action) {
      const { type, targetId = "root", insertIndex = null } = action.payload;
      pushHistory(state);
      const comp = createBaseComponent(type);
      insertNodeAt(state.root, targetId, comp, insertIndex);
      state.selectedId = comp.id;
    },
    selectComponent(state, action) {
      state.selectedId = action.payload;
    },
    updateStyle(state, action) {
      const { id, property, value } = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      pushHistory(state);
      found.node.styles = found.node.styles || {};
      found.node.styles[property] = value;
    },
    updateContent(state, action) {
      const { id, content } = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      pushHistory(state);
      found.node.content = content;
    },
    updateProps(state, action) {
      const { id, prop, value } = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      pushHistory(state);
      found.node.props = found.node.props || {};
      found.node.props[prop] = value;
    },
    deleteComponent(state, action) {
      const id = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      pushHistory(state);
      if (found.parent) {
        found.parent.children = (found.parent.children || []).filter((c) => c.id !== id);
      } else {
        state.root.children = (state.root.children || []).filter((c) => c.id !== id);
      }
      if (state.selectedId === id) state.selectedId = null;
    },
    duplicateComponent(state, action) {
      const id = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      pushHistory(state);
      const copy = cloneState(found.node);
      function remapIds(node) {
        node.id = nanoid();
        if (node.children) node.children.forEach(remapIds);
      }
      remapIds(copy);
      if (found.parent) {
        const idx = found.parent.children.findIndex((c) => c.id === id);
        found.parent.children.splice(idx + 1, 0, copy);
      } else {
        state.root.children.push(copy);
      }
      state.selectedId = copy.id;
    },
    moveComponent(state, action) {
      const { id, targetId = "root", insertIndex = null } = action.payload;
      const found = findNodeAndParent(state.root, id);
      if (!found) return;
      const targetNode = findNodeAndParent(state.root, targetId)?.node;
      if (!targetNode) return;
      function isDescendant(node, maybeDescendantId) {
        if (!node.children) return false;
        for (const c of node.children) {
          if (c.id === maybeDescendantId) return true;
          if (isDescendant(c, maybeDescendantId)) return true;
        }
        return false;
      }
      if (isDescendant(found.node, targetId)) return;
      pushHistory(state);
      if (found.parent) {
        found.parent.children = found.parent.children.filter((c) => c.id !== id);
      } else {
        state.root.children = state.root.children.filter((c) => c.id !== id);
      }
      insertNodeAt(state.root, targetId, found.node, insertIndex);
      state.selectedId = id;
    },
    importState(state, action) {
      pushHistory(state);
      const s = action.payload;
      if (s && s.root) state.root = s.root;
      state.selectedId = null;
    },
    undo(state) {
      if (state.history.length === 0) return;
      const last = state.history[state.history.length - 1];
      state.history = state.history.slice(0, -1);
      state.future = [...state.future, { root: state.root, selectedId: state.selectedId }].slice(-MAX_HISTORY);
      state.root = cloneState(last.root);
      state.selectedId = last.selectedId;
    },
    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future[state.future.length - 1];
      state.future = state.future.slice(0, -1);
      state.history = [...state.history, { root: state.root, selectedId: state.selectedId }].slice(-MAX_HISTORY);
      state.root = cloneState(next.root);
      state.selectedId = next.selectedId;
    },
    clearHistory(state) {
      state.history = [];
      state.future = [];
    },
    resetComponent(state, action) {
  const id = action.payload;
  const node = findNodeById(state.root, id);
  if (!node) return;

  const fresh = createBaseComponent(node.type);
  node.styles = fresh.styles;
  node.props = fresh.props;
  node.content = fresh.content;
  node.children = fresh.children;
}

  },
});
export const {
  addComponent,
  selectComponent,
  updateStyle,
  updateContent,
  updateProps,
  deleteComponent,
  duplicateComponent,
  moveComponent,
  importState,
  undo,
  redo,
  clearHistory,
  resetComponent
} = builderSlice.actions;
export default builderSlice.reducer;
