import { Link } from "react-router-dom";
import { useT } from "../features/i18n/useT";
import { ArrowRightIcon, FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "./Icons";
import { footerLinks } from "../data/catalog";

export default function Footer() {
  const t = useT();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col subscribe-col">
          <h2>fastcard</h2>
          <h3>{t("footer.subscribe")}</h3>
          <p>{t("footer.subscribeText")}</p>
          <label className="footer-input">
            <span className="sr-only">Email</span>
            <input type="email" placeholder="Enter your email" />
            <ArrowRightIcon />
          </label>
        </div>

        <div className="footer-col">
          <h3>{t("footer.support")}</h3>
          {footerLinks.support.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>

        <div className="footer-col">
          <h3>{t("footer.account")}</h3>
          {footerLinks.account.map((item) => (
            <Link key={item} to={item === "Shop" ? "/products" : `/${item.toLowerCase().replace(" ", "-")}`}>
              {item}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h3>{t("footer.quick")}</h3>
          {footerLinks.quick.map((item) => (
            <Link key={item} to={item === "Contact" ? "/contact" : "/"}>
              {item}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h3>{t("footer.social")}</h3>
          <div className="social-row" aria-label="Social links">
            <a href="https://facebook.com" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://x.com" aria-label="X">
              <XIcon />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">(c) Copyright Rimel 2022. All right reserved</div>
    </footer>
  );
}
