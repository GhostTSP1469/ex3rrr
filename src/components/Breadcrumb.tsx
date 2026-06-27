import { Link } from "react-router-dom";

interface BreadcrumbProps {
  items: string[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item) => (
        <span key={item}>
          <span className="slash">/</span>
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}
