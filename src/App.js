import React from "react";
import "./App.css";
import AppRouter from "./app/routes/AppRouter";
import AppHeader from "./shared/components/AppHeader";

function App() {
  return (
    <div className="app-container">
      <AppHeader />
      <AppRouter />
    </div>
  );
}

export default App;