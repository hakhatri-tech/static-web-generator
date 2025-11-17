import React from "react";
import Left from "./Components/Left";
import Center from "./Components/Center";
import Right from "./Components/Right";
import { useSelector } from "react-redux";
import { exportToHTML } from "./utils/exportHTML";

export default function App() {
  const components = useSelector((s) => s.builder.componentsOnPage);

  const handleExport = () => {
    const html = exportToHTML(components);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "exported-website.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h2>Static Site Builder</h2>
        <div>
          <button onClick={handleExport} className="btn primary">Export single HTML</button>
        </div>
      </header>

      <div className="layout">
        <Left />
        <Center />
        <Right />
      </div>
    </div>
  );
}
