import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MealPlanningProvider } from "./contexts/MealPlanningContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MealPlanningProvider><App /></MealPlanningProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
