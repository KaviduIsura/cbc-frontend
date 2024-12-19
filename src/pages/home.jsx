import "./home.css";

export default function HomePage() {
    return (
        <div className="home-container">
            <header className="home-header">
                <nav className="home-nav">
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <section className="hero-section">
                    <h1>Welcome to Our Website</h1>
                    <p>Your one-stop solution for all your needs.</p>
                    <button>Get Started</button>
                </section>
                <section className="features-section">
                    <div className="feature">
                        <h2>Feature 1</h2>
                        <p>Details about this amazing feature.</p>
                    </div>
                    <div className="feature">
                        <h2>Feature 2</h2>
                        <p>Details about another cool feature.</p>
                    </div>
                    <div className="feature">
                        <h2>Feature 3</h2>
                        <p>Information about yet another feature.</p>
                    </div>
                </section>
            </main>
            <footer className="home-footer">
                <p>&copy; 2024 Your Website. All rights reserved.</p>
            </footer>
        </div>
    );
}
