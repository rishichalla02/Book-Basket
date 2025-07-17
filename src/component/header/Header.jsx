import Greeting from "./Greeting";
import Logout from "../login/Logout";
import "../header/header.css";
import "../button/button.css";
import Button from "../button/Button";
import { CreditCard, Home, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ReactTooltip from "react-tooltip";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const homeTooltip =
    user?.role === "admin"
      ? "Go to Dashboard"
      : user?.role === "user"
      ? "Go to Home"
      : "Login to continue";

  const handleHome = () => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else if (user?.role === "user") {
      navigate("/home");
    }
  };
  const handleCartShop = () => {
    navigate("/cart");
  };
  const handleHistory = () => {
    navigate("/history");
  };
  return (
    <header className="header">
      <Greeting />
      <div className="title-container">
        <Button
          className="header-btn"
          type="button"
          text=""
          Icon={Home}
          onClick={handleHome}
          disabled={false}
          data-tip={homeTooltip}
          data-for="home-tooltip"
        />
        <ReactTooltip
          className="text-sm"
          id="home-tooltip"
          place="bottom"
          effect="solid"
        />
        <Button
          className="header-btn"
          type="button"
          text=""
          Icon={ShoppingCart}
          onClick={handleCartShop}
          disabled={!user || user.role !== "user"}
          data-tip="Go to Cart"
          data-for="cart-tooltip"
        />
        <ReactTooltip
          className="text-sm"
          id="cart-tooltip"
          place="bottom"
          effect="solid"
        />
        <Button
          className="header-btn"
          type="button"
          text=""
          Icon={CreditCard}
          onClick={handleHistory}
          disabled={!user || user.role !== "user"}
          data-tip="Go to Purchased"
          data-for="history-tooltip"
        />
        <ReactTooltip
          className="text-sm"
          id="history-tooltip"
          place="bottom"
          effect="solid"
        />
        <Logout />
      </div>
    </header>
  );
};

export default Header;
