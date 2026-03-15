interface HomeSectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

const HomeSectionHeader = ({ id, eyebrow, title, description }: HomeSectionHeaderProps) => {
  return (
    <header className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-black text-primary sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-primary/80 sm:text-base">{description}</p>
    </header>
  );
};

export default HomeSectionHeader;
