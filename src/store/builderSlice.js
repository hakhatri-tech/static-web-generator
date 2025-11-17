import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  componentsOnPage: [
    // A sample initial page (one hero + one text) - you can remove if you want blank start
    {
      id: 1,
      type: "hero",
      props: { title: "Welcome to My Site", subtitle: "Edit me", padding: "40px", bg: "#eef2ff", color: "#0f172a" }
    },
    {
      id: 2,
      type: "text",
      props: { text: "This is a sample paragraph. Click and edit me.", size: "16", color: "#111" }
    }
  ],
  selectedId: null
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addComponent(state, action) {
      const nextId = Date.now();
      state.componentsOnPage.push({
        id: nextId,
        type: action.payload.type,
        props: action.payload.props || {}
      });
      state.selectedId = nextId;
    },
    selectComponent(state, action) {
      state.selectedId = action.payload;
    },
    updateComponent(state, action) {
      const { id, props } = action.payload;
      const c = state.componentsOnPage.find((x) => x.id === id);
      if (c) c.props = { ...c.props, ...props };
    },
    deleteComponent(state, action) {
      state.componentsOnPage = state.componentsOnPage.filter((c) => c.id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = null;
    },
    reorderComponents(state, action) {
      state.componentsOnPage = action.payload;
    },
    clearPage(state) {
      state.componentsOnPage = [];
      state.selectedId = null;
    }
  }
});

export const {
  addComponent,
  selectComponent,
  updateComponent,
  deleteComponent,
  reorderComponents,
  clearPage
} = builderSlice.actions;

export default builderSlice.reducer;
