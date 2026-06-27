import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="not-found-page">
        <h1>404 Not Found</h1>
        <p>Your visited page not found. You may go home page.</p>
        <Link to="/" className="primary-btn">
          Back to home page
        </Link>
      </main>

      <Footer />
    </>
  );
}
