import "./payment.css";

const OrderSuccessModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>✅ Order Placed Successfully!</h2>
        <p className="mb-2">Thank you for shopping with us.</p>
        <button onClick={onClose} className="btn-ok">
          OK
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
