// src/App.jsx
import React from "react";
import Left from "./Components/Left";
import Center from "./Components/Center";
import Right from "./Components/Right";
import "./index.css";

export default function App() {
  return (
    <div className="builder-app" style={{ display: "flex", height: "100vh", gap: 12 }}>
      <Left />
      <Center />
      <Right />
    </div>
  );
}
