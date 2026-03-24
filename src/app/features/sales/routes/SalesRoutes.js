import { Route } from "react-router-dom";
import SalesPage from "../pages/SalesPage";

function SalesRoutes() {
  return (
    <>
      <Route path="/sales" element={<SalesPage />} />
    </>
  );
}

export default SalesRoutes;