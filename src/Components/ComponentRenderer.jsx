// src/components/ComponentRenderer.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectComponent } from "../store/builderSlice";
import { useEffect, useRef } from "react";

/**
 * Renders a component WITH its children inside the DOM element.
 * This is REQUIRED for flex/grid/container layouts to work.
 */

function styleObj(styles = {}) {
  const s = { ...styles };

  // support backgroundImageUrl stored in styles
  if (s.backgroundImageUrl) {
    s.backgroundImage = `url(${s.backgroundImageUrl})`;
    s.backgroundSize = s.backgroundSize || "cover";
    s.backgroundRepeat = s.backgroundRepeat || "no-repeat";
    s.backgroundPosition = s.backgroundPosition || "center";
  }

  // convert numeric styles to px
  const numericKeys = ["fontSize", "borderRadius", "gap", "width", "height", "padding", "margin", "lineHeight"];
  numericKeys.forEach((key) => {
    if (typeof s[key] === "number") s[key] = `${s[key]}px`;
  });

  return s;
}

// ----------------------------------------------
// ⭐ NEW: Tag mapper — makes rendering children easy
// ----------------------------------------------
function getTag(type) {
  switch (type) {
    case "heading":
      return "h2";
    case "text":
      return "p";
    case "span":
      return "span";
    case "strong":
      return "strong";
    case "em":
      return "em";
    case "ul":
      return "ul";
    case "li":
      return "li";
    case "image":
      return "img";
    case "video":
      return "video";
    case "iframe":
      return "iframe";
    case "input":
      return "input";
    case "textarea":
      return "textarea";
    case "checkbox":
      return "input";
    case "button":
      return "button";
    case "card":
    case "section":
    case "div":
    case "grid":
    case "container":
    case "main":
    case "footer":
    case "header":
    case "aside":
    case "article":
      return "div";
    case "form":
      return "form";
    case "table":
      return "table";
    case "svg":
      return "svg";
    case "hr":
      return "hr";
    default:
      return "div";
  }
}

export default function ComponentRenderer({ comp, children }) {
  if (!comp) return null;
  const dispatch = useDispatch();
  const selectedId = useSelector((s) => s.builder.selectedId);
  const selectedIds = useSelector((s) => s.builder.selectedIds || []);
  const selected = selectedId === comp.id || selectedIds.includes(comp.id);

  const Tag = getTag(comp.type);
  const styles = styleObj(comp.styles || {});
  const props = comp.props || {};
  const elementStyle = {
    ...styles,
    outline: selected ? "3px solid #2563eb" : "none",
    boxSizing: "border-box",
  };

  // Special handling for IMG, VIDEO, INPUT, IFRAME, CHECKBOX
  // FINAL IMAGE RENDERER — SAFE FOR ALL LAYOUTS
  // CLEAN IMG RENDERING (no wrapper)
  // CLEAN IMG RENDERING (no extra wrapper)
  if (Tag === "img") {

    const imgStyle = {
      ...styles,
      outline: selected ? "3px solid #2563eb" : "none",
      boxSizing: "border-box",
      display: "inline-block",
    };

    return (
      <img
        data-id={comp.id}
        src={props.src || comp.content || ""}
        alt={props.alt || ""}
        style={imgStyle}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(selectComponent(comp.id));
        }}
        {...props}
      />
    );
  }


  if (Tag === "video") return <video style={styles} controls {...props} />;
  if (Tag === "input") return <input style={styles} {...props} />;
  if (Tag === "iframe") return <iframe style={styles} {...props} title={props.title || "embed"} />;

  // NAVBAR special layout
  // NAVBAR fixed — DO NOT render children here
  // NAVBAR — render normally, but keep correct Tag and styling


  // Slider logic
  useEffect(() => {
    if (comp.sliderImages && comp.sliderImages.length > 0) {
      const settings = comp.sliderSettings || { autoplay: true, interval: 3000 };
      let index = 0;

      const intervalId = setInterval(() => {
        if (!settings.autoplay) return;

        const next = (index + 1) % comp.sliderImages.length;
        index = next;

        elementRef.current.style.backgroundImage = `url(${comp.sliderImages[index]})`;
        elementRef.current.style.backgroundRepeat = "no-repeat";
        elementRef.current.style.backgroundSize = "cover";
        elementRef.current.style.backgroundPosition = "center";

      }, settings.interval);

      return () => clearInterval(intervalId);
    }
  }, [comp.sliderImages, comp.sliderSettings]);
  const elementRef = useRef(null);

  if (comp.type === "navbar" || comp.type === "nav") {
    return (
      <nav
        ref={elementRef}
        data-id={comp.id}
        style={elementStyle}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(selectComponent(comp.id));
        }}
      >
        {children}
      </nav>
    );
  }

  // If user added a link, wrap the component into <a>



 

// If component has an href prop
if (comp.props?.href) {
  const href = comp.props.href;

  // ---- CASE 1: Section navigation (#id) ----
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        target="_self" 
        onClick={(e) => {
          e.stopPropagation();  // allow selecting in editor
          
          // Allow browser scroll on Ctrl+Click OR export output
          if (e.ctrlKey || e.metaKey) return;

          const el = document.querySelector(href);
          if (el) {
            e.preventDefault(); // stop page reload
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        <Tag
  ref={elementRef}
  id={comp.props?.id || comp.id}   // 🔥 <-- THIS FIXES SCROLL!
  style={elementStyle}
  {...props}
  data-id={comp.id}
  onClick={(e) => {
    e.stopPropagation();
    dispatch(selectComponent(comp.id));
  }}
>
          {comp.content}
          {children}
        </Tag>
      </a>
    );
  }

  // ---- CASE 2: Normal external link ----
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ textDecoration: "none", display: "inline-block" }}
    >
      <Tag
  ref={elementRef}
  id={comp.props?.id || comp.id}   // 🔥 <-- THIS FIXES SCROLL!
  style={elementStyle}
  {...props}
  data-id={comp.id}
  onClick={(e) => {
    e.stopPropagation();
    dispatch(selectComponent(comp.id));
  }}
>
        {comp.content}
        {children}
      </Tag>
    </a>
  );
}






return (
  <Tag
    ref={elementRef}
    className="slider-fade"
    style={elementStyle}
    {...props}
    data-id={comp.id}
    onClick={(e) => {
      e.stopPropagation();
      dispatch(selectComponent(comp.id));
    }}
  >
    {comp.content}
    {children}
  </Tag>
);




}