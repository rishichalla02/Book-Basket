import "../cart/cart.css";
import "../../component/button/button.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../feature/books/cartSlice";
import Button from "../../component/button/Button";
import Header from "../../component/header/Header";
import Loading from "../../component/loading/Loading";
import { ArrowBigLeftDashIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { get, ref, set, remove, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../component/auth/AuthContext";
import Payment from "../../component/payment/Payment";
import OrderSuccessModal from "../../component/payment/OrderSuccessModal";
import ReactTooltip from "react-tooltip";
import Footer from "../../component/footer/Footer";

const Cart = () => {
  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasFetchedCart = useRef(false);
  const isInitialSync = useRef(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Load cart from Firebase with new structure: carts -> userId -> items -> bookId
  useEffect(() => {
    if (user && !hasFetchedCart.current) {
      const uid = user.uid;
      const cartItemsRef = ref(db, `carts/${uid}/items`);

      // Set refreshing state if this is not the initial load
      if (!isInitialSync.current) {
        setIsRefreshing(true);
      }

      get(cartItemsRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert Firebase object to array format expected by Redux
            const fetchedCart = Object.entries(data).map(
              ([bookId, bookData]) => ({
                id: bookId,
                ...bookData,
              })
            );
            dispatch(setCart(fetchedCart));
          } else {
            // If no cart data exists, set empty cart
            dispatch(setCart([]));
          }
        })
        .catch((err) => console.error("Failed to load cart:", err))
        .finally(() => {
          hasFetchedCart.current = true;
          isInitialSync.current = false;
          setIsCartLoaded(true);
          setInitialLoading(false);
          setIsRefreshing(false);
        });
    } else if (!user) {
      setInitialLoading(false);
      setIsCartLoaded(true);
    }
  }, [user, dispatch]);

  // Set up real-time listener for cart changes (after initial load)
  useEffect(() => {
    if (user && isCartLoaded && !isInitialSync.current) {
      const uid = user.uid;
      const cartItemsRef = ref(db, `carts/${uid}/items`);

      const unsubscribe = onValue(
        cartItemsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const fetchedCart = Object.entries(data).map(
              ([bookId, bookData]) => ({
                id: bookId,
                ...bookData,
              })
            );
            dispatch(setCart(fetchedCart));
          } else {
            dispatch(setCart([]));
          }
          // Don't show loading for real-time updates
        },
        (error) => {
          console.error("Firebase real-time cart error:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [user, dispatch, isCartLoaded]);

  // Handle page refresh/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Reset states when page is about to reload
      setIsRefreshing(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleRemove = (bookId) => {
    // Remove from Redux store
    dispatch(removeFromCart(bookId));

    // Remove from Firebase
    if (user) {
      const uid = user.uid;
      const bookItemRef = ref(db, `carts/${uid}/items/${bookId}`);
      remove(bookItemRef)
        .then(() => console.log(`Removed ${bookId} from Firebase`))
        .catch((err) => console.error(`Failed to remove ${bookId}:`, err));
    }
  };

  const handleIncrease = (bookId) => {
    dispatch(increaseQty(bookId));

    // Update quantity in Firebase
    if (user) {
      const uid = user.uid;
      const item = cartItems.find((item) => item.id === bookId);
      if (item) {
        const bookItemRef = ref(db, `carts/${uid}/items/${bookId}/quantity`);
        set(bookItemRef, item.quantity + 1).catch((err) =>
          console.error(`Failed to update quantity:`, err)
        );
      }
    }
  };

  const handleDecrease = (bookId) => {
    dispatch(decreaseQty(bookId));

    // Update quantity in Firebase
    if (user) {
      const uid = user.uid;
      const item = cartItems.find((item) => item.id === bookId);
      if (item && item.quantity > 1) {
        const bookItemRef = ref(db, `carts/${uid}/items/${bookId}/quantity`);
        set(bookItemRef, item.quantity - 1).catch((err) =>
          console.error(`Failed to update quantity:`, err)
        );
      }
    }
  };

  // handle selected items
  const handleItemSelect = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  // handle select all items
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Unselect all
    } else {
      setSelectedItems(cartItems.map((item) => item.id)); // Select all
    }
  };

  const isAllSelected =
    selectedItems.length === cartItems.length && cartItems.length > 0;

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

  const selectedItemCount = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);

  // Show full page loading overlay only during initial load
  if (initialLoading) {
    return (
      <div className="cart">
        <div className="cart-wrapper">
          <Header />
          <Loading
            type="spinner"
            size="large"
            message="Loading your cart..."
            overlay={true}
            className="text-black"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <Header />
      <div className="cart-wrapper">
        <div className="cart-container">
          <div className="cart-section">
            <div className="left-section">
              <div className="shopping">
                <Button
                  text=""
                  className="back-icon"
                  type="button"
                  disabled={false}
                  Icon={ArrowBigLeftDashIcon}
                  onClick={handleBackToHome}
                  data-tip="Back"
                  data-for="back-tooltip"
                />
                <ReactTooltip id="back-tooltip" place="bottom" effect="solid" />
                <h2>Shopping Cart</h2>
                {cartItems.length > 0 && (
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </label>
                )}
              </div>

              {/* Show loading above cart items during refresh */}
              {isRefreshing && (
                <div className="cart-refresh-loading">
                  <Loading
                    type="spinner"
                    size="medium"
                    message="Refreshing cart items..."
                    overlay={false}
                    className="text-gray-600"
                  />
                </div>
              )}

              {!isRefreshing && cartItems.length === 0 ? (
                <div className="empty-cart-msg">
                  Your cart is empty. Browse books to add!
                </div>
              ) : (
                !isRefreshing &&
                cartItems.map((item, index) => {
                  const key = item.id || `fallback-${index}`;
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 1;
                  return (
                    <div className="cart-row" key={key}>
                      <div className="cart-content">
                        <div className="max-[500px]:flex-row flex gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                          />
                          <div className="cart-image">
                            <img
                              src={item.image || "book.jpg"}
                              alt={item.title}
                            />
                          </div>
                        </div>
                        <div className="cart-details">
                          <h3>{item.title}</h3>
                          <p className="author">by {item.author}</p>
                          <p className="description">{item.description}</p>
                          <p className="category">Category: {item.category}</p>

                          <div className="qty-delete-row">
                            <div className="qty-controls">
                              <Button
                                text="-"
                                type="button"
                                onClick={() => handleDecrease(item.id)}
                                disabled={quantity <= 1}
                              />
                              <span>{quantity}</span>
                              <Button
                                text="+"
                                type="button"
                                onClick={() => handleIncrease(item.id)}
                              />
                            </div>

                            <Button
                              className="btn-delete text-white"
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              text=""
                              Icon={Trash2}
                            />
                          </div>
                        </div>
                        <div className="cart-price">₹{price * quantity}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="right-section">
              <div className="summary-box h-fit">
                <p className="subtotal">
                  Subtotal ({selectedItemCount} items):{" "}
                  <strong>₹{selectedTotal}</strong>
                </p>
                <Button
                  className="buy-btn"
                  type="submit"
                  disabled={selectedItems.length === 0}
                  text="Proceed to Buy"
                  onClick={() => setShowPaymentModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Payment
        selectedItems={cartItems.filter((item) =>
          selectedItems.includes(item.id)
        )}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onOrderPlaced={() => setShowSuccessModal(true)}
        user={user}
      />

      <OrderSuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <Footer />
    </div>
  );
};

export default Cart;
