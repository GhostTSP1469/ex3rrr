import type { CSSProperties } from "react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
}

export default function StarRating({ rating, reviews }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-row" aria-label={`${rating} of 5 stars`}>
      <span className="stars">
        {stars.map((position) => {
          // доля закраски этой звезды: 1 — целая, 0.5 — половина, 0 — пустая
          const fill = Math.max(0, Math.min(1, rating - (position - 1)));
          return (
            <b className="star" style={{ "--fill": `${fill * 100}%` } as CSSProperties} key={position}>
              ★
            </b>
          );
        })}
      </span>
      {reviews ? <em>({reviews})</em> : null}
    </div>
  );
}
