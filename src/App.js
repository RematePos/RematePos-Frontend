import React from "react";
import AppRouter from "./app/routes/AppRouter";
import { AuthProvider } from "./app/features/auth/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
