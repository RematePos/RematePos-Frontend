import "./App.css";
import "./app/styles/styles.css";
import AppRouter from "./app/routes/AppRouter";
import AppHeader from "./app/shared/components/AppHeader";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <main className="app-main">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;