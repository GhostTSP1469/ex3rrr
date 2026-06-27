import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Contact() {
  return (
    <>
      <Header />

      <main className="container page-space contact-page">
        <Breadcrumb items={["Contact"]} />

        <div className="contact-layout">
          <aside className="contact-info-card">
            <section>
              <div className="contact-title">
                <span>☎</span>
                <h2>Call To Us</h2>
              </div>
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: +8801611112222</p>
            </section>

            <hr />

            <section>
              <div className="contact-title">
                <span>✉</span>
                <h2>Write To US</h2>
              </div>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </section>
          </aside>

          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <div className="contact-input-row">
              <input placeholder="Name" />
              <input placeholder="Email" />
              <input placeholder="Phone" />
            </div>
            <textarea placeholder="Your Massage" />
            <button className="primary-btn" type="submit">Send Massage</button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
