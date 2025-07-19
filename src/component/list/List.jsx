import useBookData from "../bookStore/BookData";
import Button from "../button/Button";
import Field from "../fields/Field";
import "../list/list.css";
import "../button/button.css";
import "../../screen/form/InputForm";
import Search from "../search_Bar/Search";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { Pen, Save, Trash2 } from "lucide-react";
import Loading from "../loading/Loading";
import { toast } from "react-toastify";

const List = () => {
  const navigate = useNavigate();
  const { books, handleDelete, handleEdit, loading, error } = useBookData();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [editBookId, setEditBookId] = useState(null);
  const [editedFields, setEditedFields] = useState({});

  // Update filtered books when books change
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const { user } = useAuth();
  const userRole = user?.role || "Guest";

  const handleBook = (e) => {
    e.preventDefault();

    // Only allow admin to access bookform
    if (userRole === "admin") {
      navigate("/bookform");
      toast.success("Form Loaded Successfully !");
    } else {
      // For non-admin users, redirect to home or show access denied
      navigate("/home");
      toast.error("Access denied. Admin privileges required.");
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="main-list-container">
        <Loading type="books" size="large" message="Loading books..." />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="main-list-container">
        <div className="error-message">
          <p>Error loading books: {error}</p>
          <Button onClick={() => window.location.reload()} text="Retry" />
        </div>
      </div>
    );
  }

  return (
    <div className="main-list-container">
      <div className="add-search">
        <span className="logo">
          <a href="https://book-basket-tau.vercel.app/dashboard">
            <img src="book-basket-logo.svg" alt="logo" />
          </a>
        </span>
        <div className="button-search">
          <Search books={books} onSearchResults={setFilteredBooks} />
          <div className="relative bottom-2 max-[800px]:bottom-0">
            <Button onClick={handleBook} text="Add Book" className="add-btn" />
          </div>
        </div>
      </div>
      <div className="list-container">
        <div className="tabel-container">
          <table className="list-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Delete Book</th>
                <th>Edit Book</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td>
                      {editBookId === book.id ? (
                        <Field
                          type="text"
                          placeholder="Enter Book Title"
                          className="edit-fields"
                          value={editedFields.title || ""}
                          onChange={(e) =>
                            setEditedFields({
                              ...editedFields,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        book.title
                      )}
                    </td>
                    <td>
                      {editBookId === book.id ? (
                        <Field
                          type="text"
                          placeholder="Enter Book Author"
                          className="edit-fields"
                          value={editedFields.author || ""}
                          onChange={(e) =>
                            setEditedFields({
                              ...editedFields,
                              author: e.target.value,
                            })
                          }
                        />
                      ) : (
                        book.author
                      )}
                    </td>
                    <td>
                      {editBookId === book.id ? (
                        <Field
                          type="text"
                          placeholder="Enter Book Description"
                          className="edit-fields"
                          value={editedFields.description || ""}
                          onChange={(e) =>
                            setEditedFields({
                              ...editedFields,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        book.description
                      )}
                    </td>
                    <td>
                      {editBookId === book.id ? (
                        <Field
                          type="text"
                          placeholder="Enter Book Category"
                          className="edit-fields"
                          value={editedFields.category || ""}
                          onChange={(e) =>
                            setEditedFields({
                              ...editedFields,
                              category: e.target.value,
                            })
                          }
                        />
                      ) : (
                        book.category
                      )}
                    </td>
                    <td>
                      {editBookId === book.id ? (
                        <Field
                          type="text"
                          placeholder="Enter Book Price"
                          className="edit-fields"
                          value={editedFields.price || ""}
                          onChange={(e) =>
                            setEditedFields({
                              ...editedFields,
                              price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        book.price
                      )}
                    </td>
                    <td>
                      <Button
                        onClick={() => handleDelete(book.id)}
                        text=""
                        type="button"
                        Icon={Trash2}
                        className="list-buttons"
                      />
                    </td>
                    {editBookId === book.id ? (
                      <td>
                        <Button
                          onClick={() => {
                            handleEdit(book.id, editedFields);
                            setEditBookId(null);
                            setEditedFields({});
                          }}
                          text=""
                          Icon={Save}
                          className="list-buttons"
                        />
                      </td>
                    ) : (
                      <td>
                        <Button
                          onClick={() => {
                            setEditBookId(book.id);
                            setEditedFields({ ...book });
                          }}
                          text=""
                          type="button"
                          Icon={Pen}
                          className="list-buttons"
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <h1>📚 Book Inventory</h1>
                    <h2 className="text-2xl">No books available.</h2>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default List;
