interface CollapsibleSectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  level?: 'main' | 'sub';
}

export function CollapsibleSectionHeader({
  title,
  isExpanded,
  onToggle,
  level = 'main'
}: CollapsibleSectionHeaderProps) {
  const isMain = level === 'main';

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left hover:bg-foreground/5 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-in-out rounded-md group mb-8 pb-3 border border-foreground/40 p-4 ${isExpanded ? 'bg-foreground/5' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`${isMain ? 'text-3xl' : 'text-2xl'} font-bold text-foreground`}>
          {title}
        </h2>
        <span className={`text-2xl text-foreground/60 ml-2 transition-all duration-200 ease-in-out ${isExpanded ? 'scale-110' : 'scale-100'}`}>
          {isExpanded ? '−' : '+'}
        </span>
      </div>
    </button>
  );
}
