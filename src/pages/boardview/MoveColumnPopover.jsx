import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MoveColumnPopover({ columns, currentIndex, onMove, children }) {
  const [search, setSearch] = useState("");

  const filtered = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) =>
      column.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="rounded-lg border-none bg-transparent p-0"
      >
        {children}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        <div className="p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search section..."
              className="pl-8"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No sections found
            </div>
          )}
          {filtered.map(({ column, index }) => {
            const isCurrent = index === currentIndex;
            return (
              <button
                key={column.title + index}
                type="button"
                disabled={isCurrent}
                onClick={() => onMove(index)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm ${
                  isCurrent
                    ? "cursor-default text-muted-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {column.title}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
