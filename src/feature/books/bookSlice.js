import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  books: [],
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
      toast.success("Book Added from Database Successfully !!")
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
      console.log("Deleting book with ID:", action.payload);
      toast.success("Book Deleted from Database Successfully !! ")
    },
    editBook: (state, action) => {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );
      if (index !== -1) {
        state.books[index] = { ...state.books[index], ...action.payload };
      }
    },
    setBooks: (state, action) => {
      state.books = action.payload;
    },
  },
});

export const { addBook, deleteBook, editBook, setBooks } = booksSlice.actions;
export default booksSlice.reducer;
