import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type List = Record<string | number, string>;

interface FilterSelectProps {
  list: List;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

function FilterSelect({ list, value, onChange, ariaLabel }: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => val && onChange(val)}
      items={list}
    >
      <SelectTrigger aria-label={ariaLabel} className="p-4.5 bg-white min-w-30">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(list).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default FilterSelect;
