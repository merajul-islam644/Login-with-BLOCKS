import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { TEAM_MEMBERS } from "./constants";
import { initialsFor } from "./utils";

const MENU_HEIGHT = 320; // matches max-h-80

export function AssigneePicker({ selected, onToggle, label = "Add assignees" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUpward, setMenuUpward] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (!menuOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuUpward(
        window.innerHeight - rect.bottom < MENU_HEIGHT &&
          rect.top > MENU_HEIGHT,
      );
    }
    setMenuOpen((v) => !v);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div
      ref={menuRef}
      className="relative flex items-center gap-2 rounded-lg border px-3 py-2"
    >
      <div className="flex flex-1 -space-x-2">
        {selected.length === 0 && (
          <span className="text-sm text-muted-foreground">No assignees</span>
        )}
        {selected.map((id) => {
          const member = TEAM_MEMBERS.find((m) => m.id === id);
          if (!member) return null;
          return (
            <Avatar key={id} className="h-8 w-8 border-2 border-background">
              <AvatarFallback>{initialsFor(member.name)}</AvatarFallback>
            </Avatar>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={label}
        className="text-muted-foreground hover:text-foreground"
        onClick={toggleMenu}
      >
        <Plus className="h-5 w-5" />
      </button>

      {menuOpen && (
        <div
          className={`absolute right-0 z-20 w-72 max-h-80 overflow-y-auto rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg ${
            menuUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {TEAM_MEMBERS.map((member) => (
            <label
              key={member.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted"
            >
              <Checkbox
                className="size-5 rounded-md"
                checked={selected.includes(member.id)}
                onCheckedChange={() => onToggle(member.id)}
              />
              <Avatar className="h-10 w-10">
                <AvatarFallback>{initialsFor(member.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{member.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
