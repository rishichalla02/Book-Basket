import "../history/history.css";
import { useEffect, useRef, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { useAuth } from "../../component/auth/AuthContext";
import { db } from "../../firebase/firebase";
import Header from "../../component/header/Header";
import Loading from "../../component/loading/Loading";
import { useNavigate } from "react-router-dom";
import Button from "../../component/button/Button";
import ReactTooltip from "react-tooltip";
import { ArrowBigLeftDashIcon, Trash2 } from "lucide-react";
import { removeFromHistory } from "../../feature/books/historySlice";
import { useDispatch } from "react-redux";
import Footer from "../../component/footer/Footer";

const History = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const isInitialSync = useRef(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleBackToCart = () => {
    navigate("/cart");
  };

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;
    const historyRef = ref(db, `purchaseHistory/${uid}`);

    const unsubscribe = onValue(historyRef, async (snapshot) => {
      const data = snapshot.val();

      if (isInitialSync.current) {
        isInitialSync.current = false;
      } else {
        setIsRefreshing(true);
      }

      if (data) {
        const now = Date.now();
        const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;

        const deletions = [];
        const validEntries = [];

        for (const [purchaseId, purchase] of Object.entries(data)) {
          const isExpired = now - purchase.createdAt > sixtyDaysInMs;
          if (isExpired) {
            const expiredRef = ref(db, `purchaseHistory/${uid}/${purchaseId}`);
            deletions.push(remove(expiredRef));
          } else {
            validEntries.push({
              id: purchaseId,
              createdAt: purchase.createdAt,
              items: purchase.items,
            });
          }
        }

        // Wait for all deletions to complete
        if (deletions.length > 0) {
          try {
            await Promise.all(deletions);
            console.log("Expired history entries removed.");
          } catch (err) {
            console.error("Error removing expired entries:", err);
          }
        }

        // Set history only with valid entries
        const sorted = validEntries.sort((a, b) => b.createdAt - a.createdAt);
        setHistory(sorted);
      } else {
        setHistory([]);
      }

      setInitialLoading(false);
      setIsRefreshing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRemove = (purchaseId) => {
    // Remove from Redux
    dispatch(removeFromHistory(purchaseId));

    // Remove from Firebase
    if (user) {
      const uid = user.uid;
      const purchaseRef = ref(db, `purchaseHistory/${uid}/${purchaseId}`);
      remove(purchaseRef)
        .then(() => {
          console.log(`Removed purchase ${purchaseId} from Firebase`);

          // Update local state to remove from UI
          setHistory((prev) => prev.filter((entry) => entry.id !== purchaseId));
        })
        .catch((err) => console.error(`Failed to remove ${purchaseId}:`, err));
    }
  };

  // Show full page loading overlay only during initial load
  if (initialLoading) {
    return (
      <div className="history">
        <div className="history-wrapper">
          <Header />
          <Loading
            type="spinner"
            size="large"
            message="Loading your History..."
            overlay={true}
            className="text-black"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <Header />
      <div className="history-wrapper">
        <div className="histroty-container">
          {/* Show loading above cart items during refresh */}
          {isRefreshing && (
            <div className="history-refresh-loading">
              <Loading
                type="spinner"
                size="medium"
                message="Refreshing histroy items..."
                overlay={false}
                className="text-gray-600"
              />
            </div>
          )}
          <div className="flex items-center">
            <div className="order">
            <Button
              text=""
              className="back-icon"
              type="button"
              disabled={false}
              Icon={ArrowBigLeftDashIcon}
              onClick={handleBackToCart}
              data-tip="Back"
              data-for="back-tooltip"
            />
            <ReactTooltip
              id="back-tooltip"
              className="back-tooltip"
              place="right"
              effect="solid"
            />
          </div>
          <h2 className="history-title">Order History</h2>
          </div>
          {!isRefreshing && history.length === 0 ? (
            <p className="empty-history-msg">No orders yet.</p>
          ) : (
            !isRefreshing &&
            history.map((order) => (
              <div key={order.id} className="history-row">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <div className="">
                  {Object.entries(order.items).map(([id, item]) => (
                    <div key={id} className="history-content">
                      <div className="history-image">
                        <img src={item.image || "book.jpg"} alt={item.title} />
                      </div>
                      <div className="histroy-details">
                        <h3>{item.title}</h3>
                        <p className="author">Author: {item.author}</p>
                        <p className="description">
                          Description: {item.description}
                        </p>
                        <p className="qty">Qty: {item.quantity}</p>
                        <p className="history-price">Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="btn-delete text-white"
                  type="button"
                  onClick={() => handleRemove(order.id)}
                  text=""
                  Icon={Trash2}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;
