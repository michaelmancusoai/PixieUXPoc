import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { DndContext } from "@dnd-kit/core";

createRoot(document.getElementById("root")!).render(
  <DndContext>
    <App />
  </DndContext>
);
