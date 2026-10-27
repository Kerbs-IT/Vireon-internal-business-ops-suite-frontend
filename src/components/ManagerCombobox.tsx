import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface ManagerOption {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}



export default function ManagerCombobox({
  managers,
  value,
  onChange,
}: {
  managers: ManagerOption[];
  value?: number;
  onChange: (id: number | null) => void;
}) {
  const selected = managers.find((m) => m.id === value) ?? null;

  return (
    <Combobox
      items={managers}
      value={selected}
      onValueChange={(item: ManagerOption | null) => onChange(item?.id ?? null)}
      itemToStringLabel={(item: ManagerOption) =>
        item ? `${item.first_name} ${item.last_name}` : ""
      }
    >
      <ComboboxInput placeholder="Select a manager" />
      <ComboboxContent>
        <ComboboxEmpty>No manager found.</ComboboxEmpty>
        <ComboboxList>
          {(item: ManagerOption) => {
            const fullName = `${item.first_name} ${item.last_name}`;
            const initials =
              `${item.first_name[0]}${item.last_name[0]}`.toUpperCase();
            return (
              <ComboboxItem key={item.id} value={item}>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-indigo-400 text-white text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.position}
                  </span>
                </div>
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
