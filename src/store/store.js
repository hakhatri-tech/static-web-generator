import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "./builderSlice";

// ✅ Load state from localStorage if available
function loadState() {
  try {
    const saved = localStorage.getItem("builderState");
    if (!saved) return undefined;
    return { builder: JSON.parse(saved) };
  } catch (err) {
    console.error("Failed to load state:", err);
    return undefined;
  }
}

// Create store with preloaded state if present
const store = configureStore({
  reducer: {
    builder: builderReducer,
  },
  preloadedState: loadState(),
});

// ✅ Save builder state to localStorage on every update
store.subscribe(() => {
  try {
    const state = store.getState().builder;
    localStorage.setItem("builderState", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state:", err);
  }
});

export default store;
