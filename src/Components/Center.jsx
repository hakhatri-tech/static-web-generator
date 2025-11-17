import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComponent, selectComponent, reorderComponents } from "../store/builderSlice";
import ComponentRenderer from "./ ComponentRenderer";


export default function Center() {
  const dispatch = useDispatch();
  const comps = useSelector((s) => s.builder.componentsOnPage);
  const selectedId = useSelector((s) => s.builder.selectedId);

  const dragItemIndex = useRef(null);

 
  function handleDrop(e) {
    e.preventDefault();
    // if dragging a template from left
    const compType = e.dataTransfer.getData("componentType");
    if (compType) {
      try {
        const obj = JSON.parse(compType);
        dispatch(addComponent({ type: obj.type, props: obj.props }));
        return;
      } catch (err) { /* ignore parse error */ }
    }
    // otherwise ignore (reordering handled per-item)
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  // item drag start (for reordering)
  function onItemDragStart(e, index) {
    dragItemIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "reorder"); // marker
  }

  // when dragging over an item, mark position (we won't show placeholder to keep simple)
  function onItemDrop(e, index) {
    e.preventDefault();
    const marker = e.dataTransfer.getData("text/plain");
    if (marker === "reorder") {
      const from = dragItemIndex.current;
      const to = index;
      if (from === null || to === null || from === to) return;
      const copy = [...comps];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      dispatch(reorderComponents(copy));
      dragItemIndex.current = null;
    }
  }

  return (
    <main className="center" onDragOver={allowDrop} onDrop={handleDrop}>
      <h3>Preview</h3>
      <div className="hint" style={{ marginBottom: 12 }}>Drop components here or drag existing items to reorder.</div>

      <div>
        {comps.length === 0 && <div className="hint">No components yet. Drag templates from left or click Add.</div>}

        {comps.map((c, idx) => (
          <div
            key={c.id}
            className={`page-item ${selectedId === c.id ? "selected" : ""}`}
            onClick={() => dispatch(selectComponent(c.id))}
            draggable
            onDragStart={(e) => onItemDragStart(e, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onItemDrop(e, idx)}
          >
            <ComponentRenderer data={c} />
          </div>
        ))}
      </div>
    </main>
  );
}

