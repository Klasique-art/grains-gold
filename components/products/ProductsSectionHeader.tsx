interface ProductsSectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

const ProductsSectionHeader = ({ id, eyebrow, title, description }: ProductsSectionHeaderProps) => {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-black text-primary sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-primary/80 sm:text-base">{description}</p>
    </header>
  );
};

export default ProductsSectionHeader;

