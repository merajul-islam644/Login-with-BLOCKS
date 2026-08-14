import { Circle, MoreHorizontal, Pencil, Plus, Trash2, Workflow } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TEAM_MEMBERS } from "./constants";
import { initialsFor } from "./utils";
import { MemberHoverCard } from "./MemberHoverCard";
import { MoveColumnPopover } from "./MoveColumnPopover";

export function BoardColumn({
  column,
  index,
  columns,
  dragOverIndex,
  draggedItem,
  onEditSection,
  onDeleteSection,
  onAddSection,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropColumn,
  onOpenItemDetail,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
}) {
  return (
    <div className="group flex w-80 shrink-0 flex-col bg-background">
      <div className="flex h-11 items-center gap-2 border-b px-4">
        <Circle className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold tracking-wide text-foreground">
          {column.title.toUpperCase()}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {column.items.length}
        </span>
        <div className="ml-auto flex items-center gap-3 text-muted-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button type="button" aria-label="Section options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  }
                />
                <TooltipContent>Section options</TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuItem onClick={() => onEditSection(index)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteSection(index)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="Add section"
                  onClick={() => onAddSection(index)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              }
            />
            <TooltipContent>Add section</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        className={`flex-1 space-y-2 overflow-y-auto p-3 ${
          dragOverIndex === index ? "bg-primary/5" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOverColumn(index);
        }}
        onDragLeave={() => onDragLeaveColumn(index)}
        onDrop={(e) => {
          e.preventDefault();
          onDropColumn(index);
        }}
      >
        {column.items.map((item) => (
          <div
            key={item.id}
            className={`cursor-grab rounded border bg-card p-4 shadow-sm transition-opacity active:cursor-grabbing ${
              draggedItem?.itemId === item.id ? "opacity-40" : ""
            }`}
            draggable
            onDragStart={() => onDragStart(index, item.id)}
            onDragEnd={onDragEnd}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{item.title}</p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-label="Item options"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                    />
                    <TooltipContent>Item options</TooltipContent>
                  </Tooltip>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => onEditItem(index, item)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteItem(index, item.id)}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {item.description && (
              <p
                className="mt-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground hover:underline"
                onClick={() =>
                  onOpenItemDetail({ item, columnTitle: column.title })
                }
              >
                {item.description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-3">
                {item.assignees.filter((id) =>
                  TEAM_MEMBERS.some((m) => m.id === id),
                ).length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No assignee
                  </span>
                )}
                {item.assignees.map((id) => {
                  const member = TEAM_MEMBERS.find((m) => m.id === id);
                  if (!member) return null;
                  return (
                    <MemberHoverCard key={id} member={member}>
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-card">
                        <AvatarFallback>
                          {initialsFor(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    </MemberHoverCard>
                  );
                })}
              </div>

              <MoveColumnPopover
                columns={columns}
                currentIndex={index}
                onMove={(targetIndex) => onMoveItem(index, item.id, targetIndex)}
              >
                <button
                  type="button"
                  aria-label="Move to section"
                  title="Move to section"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground"
                >
                  <Workflow className="h-4 w-4" />
                </button>
              </MoveColumnPopover>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="hidden w-full items-center justify-center gap-1.5 rounded border border-dashed py-2.5 text-sm text-primary hover:bg-muted/50 group-hover:flex"
          onClick={() => onAddItem(index)}
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>
    </div>
  );
}
