import { useNavigate } from "react-router-dom";
import Header from "../../component/header/Header";
import List from "../../component/list/List";
import "../dashboard/dashboard.css";
import "react-toastify/ReactToastify.css";
import { useAuth } from "../../component/auth/AuthContext";
import { useEffect } from "react";
import Footer from "../../component/footer/Footer";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <List />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
