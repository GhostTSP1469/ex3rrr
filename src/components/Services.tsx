import { DeliveryIcon, HeadsetIcon, ShieldIcon } from "./Icons";

const services = [
  {
    title: "FREE AND FAST DELIVERY",
    text: "Free delivery for all orders over $140",
    icon: DeliveryIcon,
  },
  {
    title: "24/7 CUSTOMER SERVICE",
    text: "Friendly 24/7 customer support",
    icon: HeadsetIcon,
  },
  {
    title: "MONEY BACK GUARANTEE",
    text: "We return money within 30 days",
    icon: ShieldIcon,
  },
];

export default function Services() {
  return (
    <section className="container service-strip">
      {services.map((service) => {
        const Icon = service.icon;

        return (
          <div className="service-card" key={service.title}>
            <div className="service-icon">
              <Icon />
            </div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </div>
        );
      })}
    </section>
  );
}
