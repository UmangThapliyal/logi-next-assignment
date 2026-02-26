import "./App.css";
import FilterDrawer from "./components/FilterDrawer";
import VehicleList from "./pages/VehicleList";
import { VehicleFilterProvider } from "./context";

function App() {
  return (
    <VehicleFilterProvider>
      <div className="header">
        <h3>Fleet tracking system</h3>
        <p>Real-time vehicle tracking </p>
      </div>
      <div className="vehicle-page">
        <FilterDrawer />
        <VehicleList />
      </div>
    </VehicleFilterProvider>
  );
}

export default App;
