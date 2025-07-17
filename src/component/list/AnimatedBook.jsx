import { useState } from 'react';
import '../list/animated.css';

const AnimatedBook = () => {
    const [isBookOpen, setIsBookOpen] = useState(false);

    return (
        <div className="book-container">
            <div
                className="animated-book"
                onClick={() => setIsBookOpen(!isBookOpen)}
            >
                <div className="book-spine"></div>

                <div className={`book-cover ${isBookOpen ? 'open' : ''}`}>
                    <div className="book-title">Developer's Guide</div>
                    <div className="book-subtitle">The Art of Programming</div>
                    <div className="book-author">by Code Masters</div>
                    <div className="book-decoration"></div>
                </div>

                <div className={`book-pages ${isBookOpen ? 'visible' : ''}`}>
                    <div className="page-header">Welcome to the Journey</div>

                    <div className="page-content">
                        <strong>Chapter 1: The Beginning</strong><br />
                        Every great developer started with a single line of code. Programming is not just about writing instructions for computers; it's about solving problems, creating solutions, and building the future.
                    </div>

                    <div className="page-quote">
                        "Code is like humor. When you have to explain it, it's bad." - Cory House
                    </div>

                    <div className="page-content">
                        <strong>The Developer's Mindset</strong><br />
                        A true developer thinks in algorithms, dreams in code, and sees the world as a series of problems waiting to be solved. We debug not just our code, but our thinking.
                    </div>
                </div>

                <div className="click-hint">
                    Click to {isBookOpen ? 'close' : 'open'} the book
                </div>
            </div>
        </div>
    );
};

export default AnimatedBook;