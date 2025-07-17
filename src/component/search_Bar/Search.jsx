import { useState } from "react";
import "../search_Bar/search.css";

const Search = ({ books, onSearchResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const filteredBooks = books.filter((book) => {
      return (
        book.id?.toString().includes(value) ||
        book.title?.toLowerCase().includes(value) ||
        book.author?.toLowerCase().includes(value) ||
        book.price?.toString().includes(value) ||
        book.category?.toLowerCase().includes(value)
      );
    });

    onSearchResults(filteredBooks);
  };

  return (
    <div className="search-container">
      <img src="search.svg" width={30} height={30} alt="search" />
      <input
        type="text"
        className="search-input"
        placeholder="Search by Book Name, Number, Author, Price or Category"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
