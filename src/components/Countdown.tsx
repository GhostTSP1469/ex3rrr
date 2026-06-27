import { Fragment, useEffect, useState } from "react";
import { useT } from "../features/i18n/useT";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function Countdown() {
  const t = useT();
  // Цель отсчёта фиксируется при монтировании: ~3д 23ч 19м 56с впереди.
  const [target] = useState(
    () => Date.now() + 3 * 86_400_000 + 23 * 3_600_000 + 19 * 60_000 + 56 * 1_000,
  );
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const ms = Math.max(0, remaining);
  const parts = [
    { label: t("cd.days"), value: Math.floor(ms / 86_400_000) },
    { label: t("cd.hours"), value: Math.floor((ms % 86_400_000) / 3_600_000) },
    { label: t("cd.minutes"), value: Math.floor((ms % 3_600_000) / 60_000) },
    { label: t("cd.seconds"), value: Math.floor((ms % 60_000) / 1_000) },
  ];

  return (
    <div className="countdown" aria-label="Sale countdown">
      {parts.map((part, index) => (
        <Fragment key={part.label}>
          <span>
            <b>{pad(part.value)}</b>
            {part.label}
          </span>
          {index < parts.length - 1 ? <em className="cd-colon">:</em> : null}
        </Fragment>
      ))}
    </div>
  );
}
