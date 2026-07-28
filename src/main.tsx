import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FlyerWorkflowProvider } from "./contexts/FlyerWorkflowContext";
import { MealPlanningProvider } from "./contexts/MealPlanningContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FlyerWorkflowProvider>
        <MealPlanningProvider><App /></MealPlanningProvider>
      </FlyerWorkflowProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
