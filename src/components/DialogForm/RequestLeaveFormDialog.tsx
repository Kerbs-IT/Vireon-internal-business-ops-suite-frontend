import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "../ui/textarea";

interface RequestLeaveFormDialogProps {
  trigger: React.ReactNode;
}

function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal shadow-none hover:bg-slate-50",
              value ? "text-slate-900" : "text-slate-400",
            )}
          />
        }
      >
        {value ? format(value, "MMM dd, yyyy") : placeholder}
        <CalendarIcon className="size-6 text-slate-400" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={disabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const leaveType = ["vacation", "sick", "personal"];

type DatePickerProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder: string;
  disabled?: (date: Date) => boolean;
};

export default function RequestLeaveFormDialog({
  trigger,
}): RequestLeaveFormDialogProps {
  const [leaveMode, setLeaveMode] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new time-off request</DialogDescription>
        </DialogHeader>
        <form action="">
          <Field className="mb-5">
            <FieldLabel>Leave Type</FieldLabel>
            <div className="buttons flex gap-1">
              {leaveType.map((type) => (
                  <Button
                      key={`${type}-button`}
                  onClick={() => setLeaveMode(type)}
                  className={`py-2 px-3 border hover:bg-orange-200 hover:text-orange-600 ${leaveMode === type ? "bg-orange-200 text-orange-600 border-orange-300" : "bg-slate-100 border-slate-200 text-black"}`}
                >
                  {type}
                </Button>
              ))}
            </div>
            <input type="hidden" name="leaveType" value={leaveType} />
          </Field>
          <div className="dates grid grid-cols-2 gap-6 mb-5">
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <DatePicker
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (date && endDate && endDate < date) setEndDate(undefined);
                }}
                placeholder="Mar 25, 2024"
              />
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Mar 28, 2024"
                disabled={(date) => (startDate ? date < startDate : false)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Reason</FieldLabel>
            <Textarea
              id="textarea-message"
              placeholder="Brieftly describe your reason for leave..."
            />
          </Field>
          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button variant="outline" className="hover:cursor-pointer">
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              className="bg-linear-to-r from-orange-600 border-0 outline-0 to-orange-400 p-2"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
