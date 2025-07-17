import BookData from "../../component/bookStore/BookData";
import Header from "../../component/header/Header";
import Search from "../../component/search_Bar/Search";
import Card from "../../component/card/Card";
import Loading from "../../component/loading/Loading";
import "../user/home.css";
import "../../component/button/button.css";
import Promo from "../../component/promo/Promo";
import { useAuth } from "../../component/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../component/footer/Footer";

const Home = () => {
  const { books, loading, error } = BookData(); // Make sure BookData returns loading state
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filteredBooks, setFilteredBooks] = useState([]);
  // Update filtered books when books change
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="home-container">
        <header className="m-4">
          <Header />
        </header>
        <main className="main-content">
          <Loading type="books" size="large" message="Loading books..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <header className="m-4">
          <Header />
        </header>
        <main className="main-content">
          <div className="error-message">
            <p>Error loading books: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      <header className="book-basket">
        <div className="logo">
          <a href="http://localhost:3000/home">
            <img src="book-basket-logo.svg" alt="logo" />
          </a>
        </div>
        <Search books={books} onSearchResults={setFilteredBooks} />
      </header>
      <main className="main-content">
        <section className="cards-section">
          <section>
            <Promo />
          </section>
          <div className="card-container">
            {filteredBooks.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                author={card.author}
                description={card.description}
                image={card.image}
                price={card.price}
                category={card.category}
              />
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
