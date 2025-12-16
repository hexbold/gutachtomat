interface Option {
  id: string;
  label: string;
}

interface RadioSectionProps {
  title: string;
  options: readonly Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  name: string;
}

export function RadioSection({ title, options, selectedValue, onValueChange, name }: RadioSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selectedValue === option.id}
              onChange={(e) => onValueChange(e.target.value)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
            />
            <span className="text-lg text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}