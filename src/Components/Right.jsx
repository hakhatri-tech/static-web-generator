// src/components/Right.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStyle,
  updateContent,
  deleteComponent,
  deleteComponents,
  duplicateComponent,
  undo,
  redo,
  clearHistory,
  resetComponent,
} from "../store/builderSlice";
import { findById } from "../store/selectors";
import { exportRootAsHtml } from "../utils/exportHTML";

/**
 * Simple Right Panel UI
 * - Collapsible but minimal sections
 * - Typography / Spacing / Layout / Background / Border / Shadow / Position / Advanced
 * - Safe when nothing is selected
 *
 * Uses updateStyle({ id, property, value }) and updateContent({ id, content })
 */

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 14, borderBottom: "1px solid #eef2f6", paddingBottom: 12 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: 8 }}
      >
        <strong style={{ fontSize: 14 }}>{title}</strong>
        <div style={{ color: "#6b7280", fontSize: 12 }}>{open ? "▾" : "▸"}</div>
      </div>
      {open && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>}
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <label style={{ display: "block", fontSize: 13 }}>
      <div style={{ marginBottom: 6, color: "#374151", fontSize: 13 }}>{label}</div>
      {children}
    </label>
  );
}

export default function Right() {
  const dispatch = useDispatch();
  const root = useSelector((s) => s.builder.root);
  const selectedId = useSelector((s) => s.builder.selectedId);
  const comp = findById(root, selectedId);

  // Top-level actions always visible
  const onExport = () => {
    exportRootAsHtml(root, { title: "Exported Page", fileName: "page.html" });
  };

  const setStyle = (property, value) => {
    if (!comp) return;
    dispatch(updateStyle({ id: comp.id, property, value }));
  };

  const setContent = (value) => {
    if (!comp) return;
    dispatch(updateContent({ id: comp.id, content: value }));
  };
  const setProp = (prop, value) => {
  if (!comp) return;
  dispatch({
    type: "builder/updateProps",
    payload: { id: comp.id, prop, value },
  });
};


  // Utility for numeric input that stores value with px or raw depending on propName
  const setNumeric = (property, rawValue, raw = false) => {
    if (!comp) return;
    if (raw) dispatch(updateStyle({ id: comp.id, property, value: rawValue }));
    else dispatch(updateStyle({ id: comp.id, property, value: String(rawValue) + "px" }));
  };

  return (
    <aside className="right-panel w-1/4 p-4" style={{ padding: 14, boxSizing: "border-box", overflow: "auto" }}>
      {/* Action row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => dispatch(undo())} style={{ flex: 1 }}>
          Undo
        </button>
        <button onClick={() => dispatch(redo())} style={{ flex: 1 }}>
          Redo
        </button>
        <button onClick={onExport} style={{ flex: 1 }}>
          Export
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => dispatch(resetComponent())} style={{ width: "100%" }}>
          Reset / Clear History
        </button>
      </div>

      {/* No selection placeholder */}
      {!comp && (
        <div style={{ padding: 12, color: "#6b7280", background: "#ffffff", borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No component selected</div>
          <div style={{ fontSize: 13 }}>Click a component in the canvas to edit its properties.</div>
        </div>
      )}

      {/* Selected component editor */}
      {comp && (
        <>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{comp.type}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{comp.id}</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => dispatch(deleteComponent(comp.id))}
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 8px", borderRadius: 6 }}
              >
                Delete
              </button>
              <button
                onClick={() => dispatch(duplicateComponent(comp.id))}
                style={{ background: "#06b6d4", color: "#fff", border: "none", padding: "6px 8px", borderRadius: 6 }}
              >
                Duplicate
              </button>
            </div>
          </div>

          {/* Content */}

          {/* Image Editor */}
{comp.type === "image" && (
  <Section title="Image" defaultOpen>
    <Labeled label="Image URL">
      <input
        type="text"
        placeholder="https://..."
        value={comp.props?.src || ""}
        onChange={(e) => setProp("src", e.target.value)}

        
        style={{ width: "30%" }}
      />
    </Labeled>

    <Labeled label="Alt Text">
      <input
        type="text"
        placeholder="Describe image"
        value={comp.props?.alt || ""}
        onChange={(e) =>
          dispatch({
            type: "builder/updateProps",
            payload: {
              id: comp.id,
              prop: "alt",
              value: e.target.value,
            },
          })
        }
        style={{ width: "30%" }}
      />
    </Labeled>
  </Section>
)}




          {"content" in comp && (
            <Section title="Content" defaultOpen>
              <Labeled label="Text / HTML">
                <textarea
                  value={comp.content || ""}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: "100%", minHeight: 80, resize: "vertical" }}
                />
              </Labeled>
            </Section>
          )}

          {/* Typography */}
          <Section title="Typography" defaultOpen>
            <Labeled label="Font family">
              <input
                value={comp.styles?.fontFamily || ""}
                onChange={(e) => setStyle("fontFamily", e.target.value)}
                placeholder='e.g. "Inter, system-ui"'
                style={{ width: "100%" }}
              />
            </Labeled>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Font size">
                <input
                  type="number"
                  value={parseInt(comp.styles?.fontSize) || ""}
                  onChange={(e) => setNumeric("fontSize", e.target.value)}
                  style={{ width: 120 }}
                />
              </Labeled>

              <Labeled label="Weight">
                <select
                  value={comp.styles?.fontWeight || "400"}
                  onChange={(e) => setStyle("fontWeight", e.target.value)}
                  style={{ width: 120 }}
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </Labeled>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Line height">
                <input
                  type="number"
                  step="0.1"
                  value={parseFloat(comp.styles?.lineHeight) || ""}
                  onChange={(e) => setStyle("lineHeight", e.target.value)}
                  style={{ width: 120 }}
                />
              </Labeled>

              <Labeled label="Letter spacing">
                <input
                  type="number"
                  step="0.1"
                  value={parseFloat(comp.styles?.letterSpacing) || ""}
                  onChange={(e) => setStyle("letterSpacing", e.target.value + "px")}
                  style={{ width: 120 }}
                />
              </Labeled>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Text align">
                <select value={comp.styles?.textAlign || "left"} onChange={(e) => setStyle("textAlign", e.target.value)} style={{ width: 120 }}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </Labeled>

              <Labeled label="Transform">
                <select value={comp.styles?.textTransform || "none"} onChange={(e) => setStyle("textTransform", e.target.value)} style={{ width: 120 }}>
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </Labeled>
            </div>

            <Labeled label="Color">
              <input
                type="color"
                value={comp.styles?.color || "#111827"}
                onChange={(e) => setStyle("color", e.target.value)}
                style={{ width: 72, height: 36, padding: 2 }}
              />
            </Labeled>
          </Section>

          {/* Spacing */}
          <Section title="Spacing" defaultOpen>
            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Padding (px)">
                <input
                  type="number"
                  value={parseInt(comp.styles?.padding) || 0}
                  onChange={(e) => setNumeric("padding", e.target.value)}
                  style={{ width: 120 }}
                />
              </Labeled>

              <Labeled label="Margin (px)">
                <input
                  type="number"
                  value={parseInt(comp.styles?.margin) || 0}
                  onChange={(e) => setNumeric("margin", e.target.value)}
                  style={{ width: 120 }}
                />
              </Labeled>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Width (px / % / auto)">
                <input value={comp.styles?.width || ""} onChange={(e) => setStyle("width", e.target.value)} placeholder="e.g. 100%, 320px, auto" />
              </Labeled>

              <Labeled label="Height (px / auto)">
                <input value={comp.styles?.height || ""} onChange={(e) => setStyle("height", e.target.value)} placeholder="e.g. 200px, auto" />
              </Labeled>
            </div>
          </Section>

          {/* Layout */}
          <Section title="Layout" defaultOpen>
            <Labeled label="Display">
              <select value={comp.styles?.display || "block"} onChange={(e) => setStyle("display", e.target.value)}>
                <option value="block">block</option>
                <option value="inline-block">inline-block</option>
                <option value="flex">flex</option>
                <option value="grid">grid</option>
                <option value="inline">inline</option>
              </select>
            </Labeled>

            {/* Flex controls */}
            {comp.styles?.display === "flex" && (
              <>
                <div style={{ display: "flex", gap: 8 }}>
                  <Labeled label="Direction">
                    <select value={comp.styles?.flexDirection || "row"} onChange={(e) => setStyle("flexDirection", e.target.value)}>
                      <option value="row">row</option>
                      <option value="column">column</option>
                      <option value="row-reverse">row-reverse</option>
                      <option value="column-reverse">column-reverse</option>
                    </select>
                  </Labeled>

                  <Labeled label="Wrap">
                    <select value={comp.styles?.flexWrap || "nowrap"} onChange={(e) => setStyle("flexWrap", e.target.value)}>
                      <option value="nowrap">nowrap</option>
                      <option value="wrap">wrap</option>
                      <option value="wrap-reverse">wrap-reverse</option>
                    </select>
                  </Labeled>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Labeled label="Justify">
                    <select value={comp.styles?.justifyContent || "flex-start"} onChange={(e) => setStyle("justifyContent", e.target.value)}>
                      <option value="flex-start">flex-start</option>
                      <option value="center">center</option>
                      <option value="flex-end">flex-end</option>
                      <option value="space-between">space-between</option>
                      <option value="space-around">space-around</option>
                    </select>
                  </Labeled>

                  <Labeled label="Align">
                    <select value={comp.styles?.alignItems || "stretch"} onChange={(e) => setStyle("alignItems", e.target.value)}>
                      <option value="stretch">stretch</option>
                      <option value="flex-start">flex-start</option>
                      <option value="center">center</option>
                      <option value="flex-end">flex-end</option>
                    </select>
                  </Labeled>
                </div>
              </>
            )}
          </Section>

          {/* Background */}
          <Section title="Background" defaultOpen>
            <Labeled label="Background (color / gradient)">
              <input
                type = "color"
                value={comp.styles?.background || ""}
                onChange={(e) => setStyle("background", e.target.value)}
                placeholder="e.g. #fff or linear-gradient(...)"
                style={{ width: "100%" }}
              />
               <input
             
                value={comp.styles?.background || ""}
                onChange={(e) => setStyle("background", e.target.value)}
                placeholder="e.g. #fff or linear-gradient(...)"
                style={{ width: "100%" }}
              />
            </Labeled>

            <Labeled label="Background image URL">
              <input
                value={comp.styles?.backgroundImageUrl || ""}
                onChange={(e) => setStyle("backgroundImageUrl", e.target.value)}
                placeholder="https://..."
                style={{ width: "100%" }}
              />
            </Labeled>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Size">
                <select value={comp.styles?.backgroundSize || "cover"} onChange={(e) => setStyle("backgroundSize", e.target.value)}>
                  <option value="cover">cover</option>
                  <option value="contain">contain</option>
                  <option value="auto">auto</option>
                </select>
              </Labeled>

              <Labeled label="Position">
                <select value={comp.styles?.backgroundPosition || "center"} onChange={(e) => setStyle("backgroundPosition", e.target.value)}>
                  <option value="center">center</option>
                  <option value="top">top</option>
                  <option value="bottom">bottom</option>
                  <option value="left">left</option>
                  <option value="right">right</option>
                </select>
              </Labeled>
            </div>
          </Section>

          {/* Border & Shadow */}
          <Section title="Border & Shadow" defaultOpen>
            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Border">
                <input value={comp.styles?.border || ""} onChange={(e) => setStyle("border", e.target.value)} placeholder="e.g. 1px solid #ddd" />
              </Labeled>

              <Labeled label="Radius">
                <input value={comp.styles?.borderRadius || ""} onChange={(e) => setStyle("borderRadius", e.target.value)} placeholder="e.g. 8px" />
              </Labeled>
            </div>

            <Labeled label="Box shadow">
              <input value={comp.styles?.boxShadow || ""} onChange={(e) => setStyle("boxShadow", e.target.value)} placeholder="e.g. 0 10px 30px rgba(0,0,0,0.12)" />
            </Labeled>
          </Section>

          {/* Position */}
          <Section title="Position" defaultOpen={false}>
            <Labeled label="Position">
              <select value={comp.styles?.position || "static"} onChange={(e) => setStyle("position", e.target.value)}>
                <option value="static">static</option>
                <option value="relative">relative</option>
                <option value="absolute">absolute</option>
                <option value="fixed">fixed</option>
              </select>
            </Labeled>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Top">
                <input value={comp.styles?.top || ""} onChange={(e) => setStyle("top", e.target.value)} placeholder="e.g. 10px" />
              </Labeled>

              <Labeled label="Left">
                <input value={comp.styles?.left || ""} onChange={(e) => setStyle("left", e.target.value)} placeholder="e.g. 10px" />
              </Labeled>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Labeled label="Right">
                <input value={comp.styles?.right || ""} onChange={(e) => setStyle("right", e.target.value)} placeholder="e.g. 10px" />
              </Labeled>

              <Labeled label="Bottom">
                <input value={comp.styles?.bottom || ""} onChange={(e) => setStyle("bottom", e.target.value)} placeholder="e.g. 10px" />
              </Labeled>
            </div>

            <Labeled label="Z-index">
              <input type="number" value={parseInt(comp.styles?.zIndex) || 0} onChange={(e) => setStyle("zIndex", e.target.value)} />
            </Labeled>
          </Section>

          {/* Advanced */}

          <Labeled label="Component Id">
            <input
              type="text"
              value={comp.props?.id || ""}
              onChange={(e) =>
                dispatch(updateProps({ id: comp.id, prop: "id", value: e.target.value }))
              }
            />

          </Labeled>

          <Labeled label="Button-Action">
            <input
              type="text"
              placeholder='e.g. window.open("https://google.com")'
              value={comp.props?.onClick || ""}
              onChange={(e) =>
                dispatch(updateProps({ id: comp.id, prop: "onClick", value: e.target.value }))
              }
            />


          </Labeled>




          <Section title="Advanced" defaultOpen={false}>
            <Labeled label="Custom CSS (use property:value; )">
              <input
                value={comp.styles?.customCss || ""}
                onChange={(e) => setStyle("customCss", e.target.value)}
                placeholder="e.g. backdrop-filter: blur(6px);"
              />
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Note: customCss will be applied inline (parsed by exporter).</div>
            </Labeled>

            <Labeled label="Accessibility (aria-label)">
              <input value={comp.props?.ariaLabel || ""} onChange={(e) => dispatch(updateProps({ id: comp.id, prop: "ariaLabel", value: e.target.value }))} />
            </Labeled>
          </Section>
        </>
      )}
    </aside>
  );
}