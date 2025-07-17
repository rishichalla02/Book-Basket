import { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import "./payment.css";

const Payment = ({ isOpen, onClose, onOrderPlaced, selectedItems, user }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (paymentMethod !== "cod" || !user || selectedItems.length === 0) return;

    try {
      const uid = user.uid;
      const purchaseTime = Date.now();
      const purchaseId = `purchase_${purchaseTime}`;

      const purchaseRef = ref(db, `purchaseHistory/${uid}/${purchaseId}`);
      const purchaseData = {
        createdAt: purchaseTime,
        items: selectedItems.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {}),
      };

      await set(purchaseRef, purchaseData);

      // Remove purchased items from cart
      await Promise.all(
        selectedItems.map((item) =>
          remove(ref(db, `carts/${uid}/items/${item.id}`))
        )
      );

      onOrderPlaced();
      onClose();
      setTimeout(() => {
        navigate("/history");
      }, 2000); // Redirect to history
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Payment Method</h2>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="pl-2">Cash on Delivery (COD)</span>
          </label>
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleOrder}
            className="btn-order"
            disabled={paymentMethod !== "cod"}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
