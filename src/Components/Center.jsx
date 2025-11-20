// src/components/Center.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../dnd/DragTypes";
import CustomDragLayer from "./CustomDragLayer";
import ComponentWrapper from "./ComponentWrapper";
import { addComponent, moveComponent, selectComponent } from "../store/builderSlice";
import { setSelectedIds, deleteComponents } from "../store/builderSlice";
import { useEffect } from "react";

export default function Center() {
  const root = useSelector((s) => s.builder.root);
  const dispatch = useDispatch();

 const [, dropRef] = useDrop({
  accept: [ItemTypes.NEW_COMPONENT, ItemTypes.COMPONENT],
  drop: (item, monitor) => {
    if (!monitor.isOver({ shallow: true })) return;

    const client = monitor.getClientOffset();
    const rootEl = document.querySelector("[data-id='root']");

    let insertIndex = (root.children || []).length;

    if (rootEl && client) {
      const kids = Array.from(rootEl.querySelectorAll(":scope > [data-id]"));
      for (let i = 0; i < kids.length; i++) {
        const r = kids[i].getBoundingClientRect();
        const mid = r.top + r.height / 2;
        if (client.y < mid) {
          insertIndex = i;
          break;
        }
      }
    }

    if (item.type === ItemTypes.NEW_COMPONENT) {
      dispatch(addComponent({ type: item.newType, targetId: "root", insertIndex }));
    } else {
      dispatch(moveComponent({ id: item.id, targetId: "root", insertIndex }));
    }
  },
});


  return (
    <main ref={dropRef} className="center-panel" style={{padding:"10px", overflow: "auto", flex: 1 }} onClick={() =>dispatch(selectComponent(null))}>
      <CustomDragLayer />
      <div data-id="root" className="canvas-wrapper" style={{ minHeight: 240 }}>
        {(root.children || []).map((c) => <ComponentWrapper key={c.id} node={c} />)}
      </div>
    </main>
  );
}