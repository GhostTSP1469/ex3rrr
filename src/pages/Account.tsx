import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuthStore } from "../store/authStore";
import { isAdminRole } from "../shared/auth/jwt";

export default function Account() {
  const role = useAuthStore((state) => state.role);
  const admin = isAdminRole(role);

  return (
    <>
      <Header />

      <main className="container page-space account-page">
        <Breadcrumb items={["My Account"]} />

        {admin ? (
          <Link
            to="/admin"
            className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[darkblue] px-5 py-3 font-semibold text-[color:skyblue]! shadow-sm transition-colors hover:brightness-110 dark:bg-[skyblue] dark:text-white!"
          >
            🛠 Войти в админ-панель
          </Link>
        ) : null}

        <div className="account-layout">
          <aside className="account-menu">
            <h3>Manage My Account</h3>
            <button className="active" type="button">My Profile</button>
            <button type="button">Address Book</button>
            <button type="button">My Payment Options</button>
            <h3>My Orders</h3>
            <button type="button">My Returns</button>
            <button type="button">My Cancellations</button>
            <h3>My WishList</h3>
          </aside>

          <form className="profile-card" onSubmit={(event) => event.preventDefault()}>
            <h1>Profile</h1>

            <div className="profile-grid">
              <label className="field-box">
                <span>First name</span>
                <input defaultValue="Md" />
              </label>
              <label className="field-box">
                <span>Last name</span>
                <input defaultValue="Rimel" />
              </label>
              <label className="field-box">
                <span>Email address</span>
                <input defaultValue="rimel1111@gmail.com" />
              </label>
              <label className="field-box">
                <span>Street address</span>
                <input defaultValue="Kingston, 5236, United State" />
              </label>
            </div>

            <h2>Password Changes</h2>
            <input className="plain-input" placeholder="Current password" type="password" />
            <div className="profile-grid">
              <input className="plain-input" placeholder="New password" type="password" />
              <input className="plain-input" placeholder="Confirm new password" type="password" />
            </div>

            <div className="profile-actions">
              <button className="text-btn" type="button">Cancel</button>
              <button className="primary-btn" type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
