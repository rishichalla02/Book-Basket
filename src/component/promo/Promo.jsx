import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import "../promo/promo.css";
import "../button/button.css";

const Promo = () => {
  const navigate = useNavigate();
  const handlePurchase = () => {
    
    navigate('/cart');
  }
  return (
      <section className="promo-section">
          <div className="promo-content">
          <h1>Read anywhere, any time, on any device</h1>
          <p>
            Your next read awaits with a eReader, the Books App, or
            the Web Reader
          </p>
          <Button className="promo-button" text='Purchase Book' type="button" onClick={handlePurchase}/>
        </div>
        <div className="promo-image">
          <img src="banner.png" alt="promo devices" />
        </div>
      </section>
  );
};

export default Promo;
