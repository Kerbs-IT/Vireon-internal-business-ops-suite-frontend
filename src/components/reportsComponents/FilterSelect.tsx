import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type List = Record<string | number, string >;

interface FilterSelectProps {
  list: List;
  defaultValue: string | number;
}

function FilterSelect({ list, defaultValue }: FilterSelectProps) {
    const [value, setValue] = useState(defaultValue?? "");
  return (
    <Select
      value={value}
      onValueChange={(val) => setValue(val)}
      items={list}
    >
      <SelectTrigger
        id="checkout-exp-month-ts6"
        className="p-4.5 bg-white min-w-30"
        
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(list).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default FilterSelect;
