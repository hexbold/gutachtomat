import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerWithQuickSelectProps {
  value: string | null;
  onChange: (dateStr: string | null) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function DatePickerWithQuickSelect({
  value,
  onChange,
  placeholder = 'Datum auswählen',
  className = '',
  required = false,
}: DatePickerWithQuickSelectProps) {
  const handleQuickSelect = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateStr = date.toISOString().split('T')[0];
    onChange(dateStr);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onChange(dateStr);
    } else {
      onChange(null);
    }
  };

  const selectedDate = value ? new Date(value) : null;

  const isDateSelected = (daysOffset: number): boolean => {
    if (!value) return false;
    const compareDate = new Date();
    compareDate.setDate(compareDate.getDate() + daysOffset);
    const compareDateStr = compareDate.toISOString().split('T')[0];
    return value === compareDateStr;
  };

  const isTodaySelected = isDateSelected(0);

  const inputClasses = className || "w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-surface-primary";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleQuickSelect(0)}
        className={`px-3 py-2.5 text-base font-medium rounded-lg border-2 transition-colors whitespace-nowrap ${
          isTodaySelected
            ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
            : 'text-text-secondary bg-surface-primary border-border-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }`}
      >
        Heute
      </button>
      <div className="w-32">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          placeholderText={placeholder}
          className={inputClasses}
          wrapperClassName="w-full"
          calendarClassName="custom-datepicker"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()}
          required={required}
        />
      </div>
    </div>
  );
}
