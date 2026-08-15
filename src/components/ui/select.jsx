import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext({});

const Select = ({ value, onValueChange, children, ...props }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <DropdownMenu {...props}>{children}</DropdownMenu>
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <DropdownMenuTrigger
        ref={ref}
        className={cn(
          "flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50 ml-2" aria-hidden="true" />
      </DropdownMenuTrigger>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuContent
      ref={ref}
      className={cn("min-w-[200px] rounded-md p-1", className)}
      {...props}
    >
      {children}
    </DropdownMenuContent>
  ),
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } =
      React.useContext(SelectContext);

    return (
      <DropdownMenuItem
        ref={ref}
        onClick={() => onValueChange?.(value)}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          selectedValue === value && "bg-accent text-accent-foreground",
          className,
        )}
        {...props}
      >
        {selectedValue === value && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline
                points="20 6 9 17 4 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        {children}
      </DropdownMenuItem>
    );
  },
);
SelectItem.displayName = "SelectItem";

const SelectValue = React.forwardRef(
  ({ className, placeholder, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn("block truncate", className)} {...props}>
        {children || placeholder}
      </span>
    );
  },
);
SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
