import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled") === "true";
  const { url, setErrorMessage, t } = useContext(StoreContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    let active = true;
    const verifyPayment = async () => {
      if (!sessionId) {
        setMessage("We couldn’t find your payment session.");
        return;
      }
      try {
        const response = await axios.post(`${url}/api/order/verify`, { sessionId, cancelled });
        if (!active) return;
        if (response.data.success) {
          navigate("/myorders", { replace: true });
        } else {
          setMessage(cancelled ? "No worries — your payment was cancelled." : response.data.message || "Payment was not completed.");
        }
      } catch (error) {
        if (active) {
          const errorText = error.response?.data?.message || "Unable to confirm payment right now.";
          setErrorMessage(errorText);
          setMessage(errorText);
        }
      }
    };
    verifyPayment();
    return () => { active = false; };
  }, [sessionId, cancelled, url, navigate, setErrorMessage]);

  return (
    <main className="verify page-shell">
      <div className="verify-card">
        <span className="section-kicker">{t("CHECKOUT")}</span>
        <h1>{t(message)}</h1>
        <p>{t("Your order status will be available in your account.")}</p>
        <button onClick={() => navigate(cancelled ? "/cart" : "/myorders")}>{cancelled ? t("Back to cart") : t("View my orders")}</button>
      </div>
    </main>
  );
};

export default Verify;
