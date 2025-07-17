import { getDatabase, push, ref, set } from "firebase/database";
import { app } from "../../firebase/firebase";
import {
  ArrowBigLeftDashIcon,
  Book,
  BookCheck,
  BookMarkedIcon,
  IndianRupee,
  PersonStanding,
  TextIcon,
} from "lucide-react";
import { useState } from "react";
import Button from "../../component/button/Button";
import Header from "../../component/header/Header";
import "../../component/button/button.css";
import FormField from "../../component/fields/FormField";
import AnimatedBook from "../../component/list/AnimatedBook";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addBook } from "../../feature/books/bookSlice";
import { toast } from "react-toastify";

const db = getDatabase(app);

const InputBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [booknumber, setBooknumber] = useState("");
  const [bookname, setBookname] = useState("");
  const [bookauthor, setBookauthor] = useState("");
  const [bookdescription, setBookdescription] = useState("");
  const [bookcategory, setBookcategory] = useState("");
  const [bookprice, setBookprice] = useState("");
  const [bookNumberError, setBookNumberError] = useState("");
  const [bookNameError, setBookNameError] = useState("");
  const [bookAuthorError, setBookAuthorError] = useState("");
  const [bookDescriptionError, setBookDescriptionError] = useState("");
  const [bookCategoryError, setBookCategoryError] = useState("");
  const [bookPriceError, setBookPriceError] = useState("");

  const validateWordLimit = (text, limit) =>
    text.trim().split(/\s+/).length > limit;

  const handleBook = (e) => {
    e.preventDefault();

    // Validation checks
    setBookNumberError("");
    setBookNameError("");
    setBookAuthorError("");
    setBookDescriptionError("");
    setBookCategoryError("");
    setBookPriceError("");
    if (!booknumber.trim()) {
      setBookNumberError("Book Number cannot be empty.");
      return;
    }
    if (!bookname.trim()) {
      setBookNameError("Book Name cannot be empty.");
      return;
    }
    if (!bookauthor.trim()) {
      setBookAuthorError("Author Name cannot be empty.");
      return;
    }
    if (!bookdescription.trim()) {
      setBookAuthorError("Author Name cannot be empty.");
      return;
    }
    if (!bookcategory.trim()) {
      setBookCategoryError("Book Category cannot be empty.");
      return;
    }
    if (!bookprice.trim()) {
      setBookPriceError("Book Price cannot be empty.");
      return;
    }
    // Handle submit logic here
    const newBookRef = push(ref(db, "books"));
    const newBook = {
      id: newBookRef.key,
      title: bookname,
      booknum: booknumber,
      author: bookauthor,
      description: bookdescription,
      price: bookprice,
      category: bookcategory,
    };

    set(newBookRef, newBook)
      .then(() => {
        dispatch(addBook(newBook));
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Firebase error:", err);
        toast.error("Failed to add book. Try again.");
      });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <Header />
      <div className="book-form">
        <div className="fields-book">
          <div className="flex w-full justify-between flex-row-reverse">
            <h1 className="text-lg text-black-200 flex w-full justify-center">
              Details of Book
            </h1>
            <Button
              text=""
              className="back-icon"
              type="button"
              disabled={false}
              Icon={ArrowBigLeftDashIcon}
              onClick={handleBackToDashboard}
            />
          </div>
          <div className="form-container">
            <form className="w-full" onSubmit={handleBook}>
              <FormField
                label="Book Number: "
                type="number"
                placeholder="Enter Book Number"
                Icon={BookMarkedIcon}
                value={booknumber}
                onChange={(e) => {
                  const val = e.target.value;
                  setBooknumber(val);
                  setBookNumberError("");
                }}
                error={bookNumberError}
              />
              <FormField
                label="Book Title: "
                type="text"
                placeholder="Enter Book Title"
                Icon={Book}
                value={bookname}
                onChange={(e) => {
                  const val = e.target.value;
                  setBookname(val);
                  if (validateWordLimit(e.target.value, 10)) {
                    setBookNameError("Book Name cannot exceed 10 words.");
                  } else {
                    setBookNameError("");
                  }
                }}
                error={bookNameError}
              />
              <FormField
                label="Author: "
                type="text"
                placeholder="Enter Author Name"
                Icon={PersonStanding}
                value={bookauthor}
                onChange={(e) => {
                  const val = e.target.value;
                  setBookauthor(val);
                  setBookAuthorError("");
                  if (validateWordLimit(e.target.value, 10)) {
                    setBookAuthorError("Book Name cannot exceed 10 words.");
                  } else {
                    setBookAuthorError("");
                  }
                }}
                error={bookAuthorError}
              />
              <FormField
                label="Description: "
                type="text"
                placeholder="Enter Description Name"
                Icon={TextIcon}
                value={bookdescription}
                onChange={(e) => {
                  const val = e.target.value;
                  setBookdescription(val);
                  setBookDescriptionError("");
                  if (validateWordLimit(e.target.value, 15)) {
                    setBookDescriptionError(
                      "Book Name cannot exceed 15 words."
                    );
                  } else {
                    setBookDescriptionError("");
                  }
                }}
                error={bookDescriptionError}
              />
              <FormField
                label="Category: "
                type="text"
                placeholder="Enter Book Category"
                Icon={BookCheck}
                value={bookcategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setBookcategory(val);
                  setBookCategoryError("");
                  if (validateWordLimit(e.target.value, 5)) {
                    setBookCategoryError("Book Name cannot exceed 5 words.");
                  } else {
                    setBookCategoryError("");
                  }
                }}
                error={bookCategoryError}
              />
              <FormField
                label="Price: "
                type="number"
                placeholder="Enter Book Price"
                Icon={IndianRupee}
                value={bookprice}
                onChange={(e) => {
                  const val = e.target.value;
                  setBookprice(val);
                  setBookPriceError("");
                }}
                error={bookPriceError}
              />
              <div className="items-center justify-center flex flex-col mb-4 mt-2">
                <Button type="submit" text="Add Book" className="add-btn" />
              </div>
            </form>
          </div>
        </div>
        <div className="book-scene">
          <AnimatedBook />
        </div>
      </div>
    </div>
  );
};

export default InputBook;
