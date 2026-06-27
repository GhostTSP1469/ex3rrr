import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useT } from "../features/i18n/useT";
import { useAuthStore } from "../store/authStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useGetCartQuery } from "../shared/api/storeApi";
import BrandLogo from "./BrandLogo";
import { CartIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Header() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const navigate = useNavigate();
  const t = useT();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = useGetCartQuery(undefined, { skip: !token });
  const cartCount = cart && cart.data && cart.data[0] ? cart.data[0].totalProducts : 0;

  function closeMobile() {
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <button className="mobile-menu" type="button" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </button>

        <Link to="/" className="brand-link" aria-label="Fastcard home">
          <BrandLogo />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" className={navClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            {t("nav.contact")}
          </NavLink>
          <NavLink to="/about" className={navClass}>
            {t("nav.about")}
          </NavLink>
          {!token ? (
            <NavLink to="/register" className={navClass}>
              {t("nav.signup")}
            </NavLink>
          ) : null}
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span className="sr-only">Search</span>
            <input type="search" placeholder={t("search.placeholder")} />
            <SearchIcon />
          </label>

          <LanguageSwitcher />
          <ThemeToggle />

          <Link to="/wishlist" className="header-icon" aria-label="Wishlist">
            <HeartIcon />
            {wishlistCount > 0 ? <span className="counter-badge">{wishlistCount}</span> : null}
          </Link>

          <Link to="/cart" className="header-icon" aria-label="Cart">
            <CartIcon />
            {cartCount > 0 ? <span className="counter-badge">{cartCount}</span> : null}
          </Link>

          {token ? (
            <div className="user-menu desktop-only">
              <button
                type="button"
                className={accountOpen ? "header-icon user-trigger open" : "header-icon user-trigger"}
                onClick={() => setAccountOpen((open) => !open)}
                aria-label="Account menu"
              >
                <UserIcon />
              </button>
              {accountOpen ? (
                <div className="user-dropdown">
                  <Link to="/account" onClick={() => setAccountOpen(false)}>
                    {t("menu.account")}
                  </Link>
                  <Link to="/cart" onClick={() => setAccountOpen(false)}>
                    {t("menu.cart")}
                  </Link>
                  <Link to="/wishlist" onClick={() => setAccountOpen(false)}>
                    {t("menu.wishlist")}
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    {t("menu.logout")}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/login" className="header-icon desktop-only" aria-label="Login">
              <UserIcon />
            </Link>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div className="mobile-modal" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <button className="mobile-modal-backdrop" type="button" aria-label="Close menu" onClick={closeMobile} />
          <div className="mobile-panel">
            <div className="mobile-panel-head">
              <BrandLogo />
              <button type="button" aria-label="Close menu" onClick={closeMobile}>
                ×
              </button>
            </div>

            <label className="mobile-search">
              <span className="sr-only">Search</span>
              <input type="search" placeholder={t("search.placeholder")} />
              <SearchIcon />
            </label>

            <nav className="mobile-nav" aria-label="Mobile navigation links">
              <NavLink to="/" onClick={closeMobile}>
                {t("nav.home")}
              </NavLink>
              <NavLink to="/products" onClick={closeMobile}>
                Products
              </NavLink>
              <NavLink to="/about" onClick={closeMobile}>
                {t("nav.about")}
              </NavLink>
              <NavLink to="/contact" onClick={closeMobile}>
                {t("nav.contact")}
              </NavLink>
              <NavLink to={token ? "/account" : "/login"} onClick={closeMobile}>
                Profile
              </NavLink>
              <NavLink to="/wishlist" onClick={closeMobile}>
                Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
              </NavLink>
              <NavLink to="/cart" onClick={closeMobile}>
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </NavLink>
            </nav>

            <div className="mobile-panel-actions">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {token ? (
              <button className="primary-btn mobile-auth-btn" type="button" onClick={handleLogout}>
                {t("menu.logout")}
              </button>
            ) : (
              <Link className="primary-btn mobile-auth-btn" to="/login" onClick={closeMobile}>
                Log In
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
