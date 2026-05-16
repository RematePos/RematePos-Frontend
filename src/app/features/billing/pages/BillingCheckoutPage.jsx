import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BillingCheckoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/sales", { replace: true });
  }, [navigate]);

  return null;
}
