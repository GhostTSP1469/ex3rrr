interface SectionTitleProps {
  kicker: string;
  title?: string;
  actions?: string;
}

export default function SectionTitle({ kicker, title, actions }: SectionTitleProps) {
  return (
    <div className="section-head">
      <div>
        <p className="section-kicker">
          <span />
          {kicker}
        </p>
        {title ? <h2>{title}</h2> : null}
      </div>

      {actions ? <button className="outline-small" type="button">{actions}</button> : null}
    </div>
  );
}
