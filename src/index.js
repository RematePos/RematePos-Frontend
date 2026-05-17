import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./app/styles/tokens.css";
import "./app/styles/theme.css";
import "./app/styles/animations.css";
import "./app/styles/components.css";
import "./app/styles/forms.css";
import "./app/styles/tables.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);