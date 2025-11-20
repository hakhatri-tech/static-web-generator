// src/components/Left.jsx
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../dnd/DragTypes";
import { useDispatch } from "react-redux";
import { addComponent } from "../store/builderSlice";

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          fontWeight: 600,
          cursor: "pointer",
          padding: "6px 0",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          {open ? "▾" : "▸"}
        </span>
      </div>

      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
};

const Item = ({ label, type, onAdd }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.NEW_COMPONENT,
    item: {
      type: ItemTypes.NEW_COMPONENT,
      newType: type,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      onClick={() => onAdd(type)}
      style={{
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        marginBottom: 6,
        cursor: "grab",
        background: isDragging ? "#dbeafe" : "#fff",
        transition: "0.2s",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
};

// 📦 READY-TO-USE BIG BLOCKS (HERO, NAVBAR, FEATURES, CTA, FOOTER…)
const blocks = [
  { label: "Navbar", type: "navbar" },
  { label: "Hero Section", type: "hero" },
  { label: "Feature Grid", type: "featureGrid" },
  { label: "Testimonials", type: "testimonials" },
  { label: "Call To Action", type: "cta" },
  { label: "Footer", type: "footer" },
  { label: "Pricing Table", type: "pricing" },
  { label: "FAQ Accordion", type: "faq" },
  { label: "Two Column Layout", type: "twoCol" },
  { label: "Card Block", type: "cardBlock" },
];

export default function Left() {
  const dispatch = useDispatch();

  const add = (type) => {
    dispatch(addComponent({ type, targetId: "root", insertIndex: null }));
  };

  return (
    <aside
      style={{
        width: 280,
        padding: 16,
        borderRight: "1px solid #e5e7eb",
        overflowY: "auto",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* SEARCH BOX */}
      <input
        placeholder="Search components..."
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: 14,
          borderRadius: 6,
          border: "1px solid #d1d5db",
        }}
      />

      {/* BASIC HTML ELEMENTS */}
      <Section title="Basic Elements">
        <Item label="Div" type="div" onAdd={add} />
        <Item label="Section" type="section" onAdd={add} />
        <Item label="Container" type="container" onAdd={add} />
        <Item label="Text" type="text" onAdd={add} />
        <Item label="Heading" type="heading" onAdd={add} />
        <Item label="Span" type="span" onAdd={add} />
        <Item label="Button" type="button" onAdd={add} />
        <Item label="Image" type="image" onAdd={add} />
      </Section>

      {/* MEDIA */}
      <Section title="Media">
        <Item label="Image" type="image" onAdd={add} />
        <Item label="Video" type="video" onAdd={add} />
        <Item label="Iframe" type="iframe" onAdd={add} />
      </Section>

      {/* FORM ELEMENTS */}
      <Section title="Form Elements">
        <Item label="Input" type="input" onAdd={add} />
      </Section>

      {/* LAYOUT ELEMENTS */}
      <Section title="Layout">
        <Item label="Flex Row" type="flexRow" onAdd={add} />
        <Item label="Flex Column" type="flexCol" onAdd={add} />
        <Item label="Grid" type="grid" onAdd={add} />
        <Item label="Card" type="card" onAdd={add} />
      </Section>

      {/* READY-TO-USE BLOCKS */}
      <Section title="Ready Blocks">
        {blocks.map((b) => (
          <Item key={b.type} label={b.label} type={b.type} onAdd={add} />
        ))}
      </Section>
    </aside>
  );
}
