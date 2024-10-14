import * as React from "react";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onValueChange,
  defaultValue = [],
  placeholder = "Select options",
  maxCount = 3,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const clearSelections = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedValues.slice(0, maxCount).map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                  <Badge key={value} className="mr-1">
                    {option?.label}
                    <XCircle
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(value);
                      }}
                    />
                  </Badge>
                );
              })}
              {selectedValues.length > maxCount && (
                <Badge className="bg-transparent text-foreground border-foreground/1">
                  {`+ ${selectedValues.length - maxCount} more`}
                  <XCircle
                    className="ml-2 h-4 w-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelections();
                    }}
                  />
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    className="cursor-pointer"
                  >
                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${isSelected ? "bg-primary text-primary-foreground" : "opacity-50"}`}>
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
