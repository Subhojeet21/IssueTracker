import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';
import { Checkbox } from './checkbox';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder, className }) => {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options.filter(opt => value.includes(opt.value)).map(opt => opt.label);

  let buttonLabel = placeholder || 'Select...';
  if (selectedLabels.length === 1) {
    buttonLabel = selectedLabels[0];
  } else if (selectedLabels.length === 2) {
    buttonLabel = selectedLabels.join(', ');
  } else if (selectedLabels.length > 2) {
    buttonLabel = `${selectedLabels.length} selected`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className} type="button">
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.length === 0 && <div className="text-sm text-gray-400">No options</div>}
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm px-2 py-1 rounded hover:bg-gray-100">
              <Checkbox checked={value.includes(opt.value)} onCheckedChange={() => handleToggle(opt.value)} />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 