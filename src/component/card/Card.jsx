import { useDispatch } from "react-redux";
import Button from "../button/Button";
import "../card/card.css";
import "../button/button.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../feature/books/cartSlice";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { ref, set, get } from "firebase/database";
import { db } from "../../firebase/firebase";
import ReactTooltip from "react-tooltip";

const Card = ({ id, title, author, description, image, category, price }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const coverImg = image || "book.jpg";

  const truncateWords = (text, limit = 4) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + " ...";
  };

  const handleCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart!");
      return;
    }

    const bookItem = {
      id,
      title,
      author,
      description,
      image: coverImg,
      category,
      price: Number(price) || 0,
      quantity: 1,
    };

    try {
      const uid = user.uid;
      const bookItemRef = ref(db, `carts/${uid}/items/${id}`);

      // Check if item already exists in cart
      const existingItemSnapshot = await get(bookItemRef);

      if (existingItemSnapshot.exists()) {
        // If item exists, increment quantity
        const existingItem = existingItemSnapshot.val();
        const newQuantity = existingItem.quantity + 1;

        await set(ref(db, `carts/${uid}/items/${id}/quantity`), newQuantity);

        // Update Redux store
        dispatch(
          addToCart({
            ...bookItem,
            quantity: newQuantity,
          })
        );

        toast.success(`Increased quantity of "${title}" in cart!`);
      } else {
        // If item doesn't exist, add new item
        const bookData = {
          title: title || "Untitled",
          author: author || "Unknown",
          description: description || "No description",
          price: Number(price) || 0,
          quantity: 1,
          image: coverImg,
          category: category || "Uncategorized",
          addedAt: new Date().toISOString(),
        };

        await set(bookItemRef, bookData);

        // Update Redux store
        dispatch(addToCart(bookItem));

        toast.success(`"${title}" added to cart!`);
      }

      // Navigate to cart after successful addition
      setTimeout(() => {
        navigate("/cart");
      }, 100);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <div className="card">
      <div className="card-image">
        <div className="card-category">{category}</div>
        <img src={coverImg} alt={title} />
      </div>
      <div className="card-content">
        <h1 className="card-title">{title}</h1>
        <p className="card-author">{author}</p>
        <p
          className="card-description"
          data-tip={description}
          data-for={`desc-tooltip-${id}`}
        >
          {truncateWords(description, 4)}
        </p>
        <ReactTooltip
          id={`desc-tooltip-${id}`}
          place="top"
          effect="solid"
          className="card-tooltip"
          delayShow={300}
        />
        <p className="card-price">₹ {price}</p>
        <div className="btn-card">
          <Button
            text="Add to Cart"
            className="card-button"
            onClick={handleCart}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
