import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDatabase, ref, remove, onValue, update } from "firebase/database";
import { app } from "../../firebase/firebase";
import { deleteBook, setBooks, editBook } from "../../feature/books/bookSlice";
import { toast } from "react-toastify";

const db = getDatabase(app);

const useBookData = () => {
  const [books, setBooksState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const booksRef = ref(db, "books");

    const unsubscribe = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookList = Object.entries(data).map(([id, book]) => ({
            id,
            ...book,
          }));
          dispatch(setBooks(bookList));
          setBooksState(bookList);
        } else {
          dispatch(setBooks([]));
          setBooksState([]);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Firebase read error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  const handleDelete = (id) => {
    const bookRef = ref(db, `books/${id}`);
    remove(bookRef)
      .then(() => {
        dispatch(deleteBook(id));
        toast.success("Book removed successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete from Firebase:", error);
        toast.error("Error deleting book");
      });
  };

  const handleEdit = (id, updatedFields) => {
    const bookRef = ref(db, `books/${id}`);
    update(bookRef, updatedFields)
      .then(() => {
        dispatch(editBook({ id, ...updatedFields }));
        toast.success("Book updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update Firebase:", error);
        toast.error("Error updating book");
      });
  };

  return { books, handleDelete, handleEdit, loading, error };
};

export default useBookData;
