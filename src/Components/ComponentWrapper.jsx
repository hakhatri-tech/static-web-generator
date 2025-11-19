// src/components/ComponentWrapper.jsx
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../dnd/DragTypes";
import { addComponent, moveComponent, selectComponent } from "../store/builderSlice";
import ComponentRenderer from "./ComponentRenderer";

const CONTAINER_SET = new Set(["root", "div", "section", "card", "nav", "grid"]);

// helper: compute insert index by clientY
function computeInsertIndexFromY(clientY, wrapperEl) {
  const childrenEls = Array.from(wrapperEl.querySelectorAll(":scope > [data-id]"));
  if (!childrenEls.length) return 0;
  for (let i = 0; i < childrenEls.length; i++) {
    const rect = childrenEls[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (clientY < midY) return i;
  }
  return childrenEls.length;
}

export default function ComponentWrapper({ node, depth = 0 }) {
  const dispatch = useDispatch();
  const selectedId = useSelector((s) => s.builder.selectedId);
  const isSelected = selectedId === node.id;
  const wrapperRef = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.COMPONENT,
    item: { type: ItemTypes.COMPONENT, id: node.id, node, previewComponent: { ...node, children: [] } },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver, canDrop, clientOffset }, dropRef] = useDrop({
    accept: [ItemTypes.NEW_COMPONENT, ItemTypes.COMPONENT],
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      clientOffset: monitor.getClientOffset(),
    }),
    drop: (item, monitor) => {
      if (monitor.didDrop && monitor.didDrop()) return;
      // only react if hovered shallowly
      if (!monitor.isOver({ shallow: true })) return;
      const client = monitor.getClientOffset();
      if (!client) return;
      const wrapperEl = wrapperRef.current;
      if (!wrapperEl) return;

      // if this node is not a container -> treat as sibling insertion into parent
      const targetIsContainer = CONTAINER_SET.has(node.type);

      const insertIndex = computeInsertIndexFromY(client.y, wrapperEl);

      if (targetIsContainer) {
        if (item.type === ItemTypes.NEW_COMPONENT) {
  dispatch(addComponent({ type: item.newType, targetId: node.id, insertIndex }));
  return;
}
 else {
          if (item.id === node.id) return;
          dispatch(moveComponent({ id: item.id, targetId: node.id, insertIndex }));
        }
      } else {
        // find parent wrapper element and insert there after computing index among siblings
        const parentEl = wrapperEl.parentElement;
        const parentId = parentEl?.getAttribute("data-id") || "root";
        // compute index among parent's children
        const siblings = Array.from(parentEl.querySelectorAll(":scope > [data-id]"));
        let idx = siblings.findIndex((el) => el.getAttribute("data-id") === node.id);
        // determine insertion place by clientY relative to siblings after this element
        for (let i = idx + 1; i < siblings.length; i++) {
          const r = siblings[i].getBoundingClientRect();
          const midY = r.top + r.height / 2;
          if (client.y < midY) {
            idx = i;
            break;
          } else {
            idx = i;
          }
        }
        const insertAt = idx + 1;
        if (item.type === ItemTypes.NEW_COMPONENT) {
          dispatch(addComponent({ type: item.newType, targetId: parentId, insertIndex: insertAt }));
        } else {
          dispatch(moveComponent({ id: item.id, targetId: parentId, insertIndex: insertAt }));
        }
      }
    },
  });

  const setRefs = (el) => {
    wrapperRef.current = el;
    dragRef(el);
    dropRef(el);
  };

  const wrapperStyle = {
    position: "relative",
    borderRadius: 8,
    padding: node.styles?.padding || 0,
    margin: node.styles?.margin || 0,
    outline: isSelected ? "3px solid #2563eb" : "none",
    boxShadow: isOver && canDrop ? "0 0 0 3px rgba(59,130,246,0.35)" : node.styles?.boxShadow || "none",
    opacity: isDragging ? 0.9 : 1,
    transition: "outline 120ms ease, box-shadow 120ms ease, transform 120ms ease",
    background: node.styles?.background || "transparent",
  };

  return (
    <div
      ref={setRefs}
      data-id={node.id}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(selectComponent(node.id));
      }}
      style={wrapperStyle}
    >
      <ComponentRenderer comp={node}>
  {(node.children || []).map((c) => (
    <ComponentWrapper key={c.id} node={c} depth={depth + 1} />
  ))}
</ComponentRenderer>

    </div>
  );
}
