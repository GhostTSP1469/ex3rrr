import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Services from "../components/Services";

const stats = [
  ["10.5k", "Sellers active our site"],
  ["33k", "Mopnthly Produduct Sale"],
  ["45.5k", "Customer active in our site"],
  ["25k", "Anual gross sale in our site"],
];

const team = [
  ["Tom Cruise", "Founder & Chairman", "/mockup/team-tom.png"],
  ["Emma Watson", "Managing Director", "/mockup/team-emma.png"],
  ["Will Smith", "Product Designer", "/mockup/team-will.png"],
];

export default function About() {
  return (
    <>
      <Header />

      <main className="container page-space about-page">
        <Breadcrumb items={["About"]} />

        <section className="story-layout">
          <div>
            <h1>Our Story</h1>
            <p>
              Launced in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presense in
              Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has
              10,500 sellers and 300 brands and serves 3 millions customers across the region.
            </p>
            <p>
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse
              assotment in categories ranging from consumer.
            </p>
          </div>
          <img src="/mockup/about-story.png" alt="Two shoppers with bags" />
        </section>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div className={index === 1 ? "stat-card active" : "stat-card"} key={stat[0]}>
              <span>▣</span>
              <h2>{stat[0]}</h2>
              <p>{stat[1]}</p>
            </div>
          ))}
        </section>

        <section className="team-grid">
          {team.map((person) => (
            <article className="team-card" key={person[0]}>
              <img src={person[2]} alt={person[0]} />
              <h2>{person[0]}</h2>
              <p>{person[1]}</p>
              <div>
                <span>x</span>
                <span>ig</span>
                <span>in</span>
              </div>
            </article>
          ))}
        </section>

        <div className="dots">
          <span />
          <span />
          <span className="active" />
          <span />
          <span />
        </div>

        <Services />
      </main>

      <Footer />
    </>
  );
}
