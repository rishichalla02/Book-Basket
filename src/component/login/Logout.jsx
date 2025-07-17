import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "../button/Button";
import "../button/button.css";
import { LogOutIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import ReactTooltip from "react-tooltip";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // clear auth context

  const handleLogout = async () => {
    try {
      await signOut(auth); // Properly sign out from Firebase
      setUser(null); // Clear context
      localStorage.removeItem("userRole"); // Clear role
      navigate("/"); // Redirect to login or home
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        Icon={LogOutIcon}
        className="header-btn"
        data-tip="Logout"
        data-for="logout-tooltip"
      />
      <ReactTooltip id="logout-tooltip" place="bottom" effect="solid" />
    </div>
  );
};

export default Logout;
