import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Circle,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Workflow,
  X,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { deleteBoard, getBoards, insertBoard, updateBoard } from "@/api/boards";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUS_COLORS = {
  Online: "bg-emerald-500",
  Away: "bg-amber-500",
  Offline: "bg-muted-foreground",
};

const TEAM_MEMBERS = [
  {
    id: "john-doe",
    name: "John Doe",
    title: "Frontend Engineer",
    department: "Engineering",
    status: "Online",
    tags: ["Frontend"],
    email: "john.doe@example.com",
    phone: "+1 (212) 555-0142",
    location: "San Francisco, US",
    timezone: "PST (UTC-8)",
    memberSince: 2023,
  },
  {
    id: "sarah-lee",
    name: "Sarah Lee",
    title: "Product Designer",
    department: "Design",
    status: "Away",
    tags: ["Design"],
    email: "sarah.lee@example.com",
    phone: "+1 (212) 555-0198",
    location: "New York, US",
    timezone: "EST (UTC-5)",
    memberSince: 2024,
  },
  {
    id: "alex-kim",
    name: "Alex Kim",
    title: "Backend Engineer",
    department: "Engineering",
    status: "Online",
    tags: ["Backend"],
    email: "alex.kim@example.com",
    phone: "+1 (212) 555-0173",
    location: "Seattle, US",
    timezone: "PST (UTC-8)",
    memberSince: 2022,
  },
  {
    id: "priya-patel",
    name: "Priya Patel",
    title: "Product Manager",
    department: "Product",
    status: "Offline",
    tags: ["Product"],
    email: "priya.patel@example.com",
    phone: "+1 (212) 555-0121",
    location: "Austin, US",
    timezone: "CST (UTC-6)",
    memberSince: 2023,
  },
  {
    id: "tom-wright",
    name: "Tom Wright",
    title: "QA Engineer",
    department: "Engineering",
    status: "Online",
    tags: ["QA"],
    email: "tom.wright@example.com",
    phone: "+1 (212) 555-0110",
    location: "Chicago, US",
    timezone: "CST (UTC-6)",
    memberSince: 2024,
  },
];

function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoLine({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function MemberHoverCard({ member, children }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        asChild
        className="rounded-full border-none bg-transparent p-0"
      >
        {children}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-start gap-3 p-4">
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-base">
                {initialsFor(member.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-popover ${STATUS_COLORS[member.status]}`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold">{member.name}</div>
            <div className="text-sm text-muted-foreground">{member.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[member.status]}`}
                />
                {member.status}
              </Badge>
              {member.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y border-t">
          <InfoLine icon={Mail}>{member.email}</InfoLine>
          <InfoLine icon={Phone}>{member.phone}</InfoLine>
          <InfoLine icon={MapPin}>{member.location}</InfoLine>
          <InfoLine icon={Clock}>{member.timezone}</InfoLine>
          <InfoLine icon={Building2}>{member.department}</InfoLine>
          <InfoLine icon={Briefcase}>{member.title}</InfoLine>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Member since {member.memberSince}
          </span>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MoveColumnPopover({ columns, currentIndex, onMove, children }) {
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

const defaultColumns = [
  { title: "To Do", items: [], boardRefs: [] },
  { title: "In Progress", items: [], boardRefs: [] },
  { title: "Completed", items: [], boardRefs: [] },
];

// boardRefs tracks, per column, which backend board records (and their exact
// Items payload) back that column — needed so renaming a column can push the
// new ColumnName to every board record that contains it without clobbering
// items that belong to a different board record.
function mapBoardsToColumns(boardItems) {
  const columnsByName = new Map(
    defaultColumns.map((col) => [
      col.title,
      { title: col.title, items: [], boardRefs: [] },
    ]),
  );

  for (const board of boardItems ?? []) {
    for (const column of board.Columns ?? []) {
      const existing = columnsByName.get(column.ColumnName);
      const rawItems = column.Items ?? [];
      // Item.ItemId comes back null from the API — the board's own top-level
      // ItemId is what insertBoard/updateBoard actually key off of, so it
      // doubles as each item's id here to keep boardRefs lookups working.
      const mappedItems = rawItems.map((item) => ({
        id: board.ItemId || crypto.randomUUID(),
        title: item.Title,
        description: item.Description ?? "",
        assignees: item.Assignees ?? [],
      }));
      const boardRef = {
        itemId: board.ItemId,
        items: rawItems.map((item) => ({
          Title: item.Title,
          Description: item.Description ?? "",
          Assignees: item.Assignees ?? [],
        })),
      };

      if (existing) {
        existing.items.push(...mappedItems);
        existing.boardRefs.push(boardRef);
      } else {
        columnsByName.set(column.ColumnName, {
          title: column.ColumnName,
          items: mappedItems,
          boardRefs: [boardRef],
        });
      }
    }
  }

  return Array.from(columnsByName.values());
}

const DUMMY_LABEL_POOL = [
  { name: "bug", color: "bg-red-500" },
  { name: "feature", color: "bg-blue-500" },
  { name: "enhancement", color: "bg-purple-500" },
  { name: "documentation", color: "bg-emerald-500" },
  { name: "good first issue", color: "bg-teal-500" },
];
const DUMMY_PRIORITY_POOL = [
  { value: "Low", color: "bg-slate-400" },
  { value: "Medium", color: "bg-amber-500" },
  { value: "High", color: "bg-red-500" },
];
const DUMMY_STATUS_POOL = ["Todo", "In Review", "Blocked", "Ready"];
const DUMMY_MILESTONE_POOL = ["v1.0 Launch", "Sprint 12", "Backlog", "Q3 Cleanup"];
const DUMMY_ACTIVITY_VERBS = ["opened this", "added a comment on", "moved", "labeled"];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Deterministic per-item dummy metadata — GitHub-issue-panel-style fields
// (labels, priority, status, milestone, due date, activity) that aren't part
// of the real data model, generated only for display in the detail drawer.
function dummyMetaFor(item) {
  const hash = hashString(item.id || item.title || "");
  const labelCount = (hash % 3) + 1;
  const labels = Array.from({ length: labelCount }, (_, i) =>
    DUMMY_LABEL_POOL[(hash + i * 7) % DUMMY_LABEL_POOL.length],
  );
  const priority = DUMMY_PRIORITY_POOL[hash % DUMMY_PRIORITY_POOL.length];
  const status = DUMMY_STATUS_POOL[(hash >> 2) % DUMMY_STATUS_POOL.length];
  const milestone = DUMMY_MILESTONE_POOL[(hash >> 4) % DUMMY_MILESTONE_POOL.length];
  const dueInDays = (hash % 21) - 5;
  const dueDate = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000);
  const activity = Array.from({ length: 2 + (hash % 2) }, (_, i) => {
    const daysAgo = ((hash >> (i + 3)) % 10) + i;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return {
      verb: DUMMY_ACTIVITY_VERBS[(hash + i) % DUMMY_ACTIVITY_VERBS.length],
      date,
    };
  });

  return { labels, priority, status, milestone, dueDate, dueInDays, activity };
}

export default function Boardview() {
  const [columns, setColumns] = useState(defaultColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    getBoards()
      .then((data) => {
        const mapped = mapBoardsToColumns(data?.items);
        if (mapped.length === 0) return;

        setColumns((prev) => {
          const mappedTitles = new Set(mapped.map((col) => col.title));
          const localOnly = prev.filter(
            (col) => !mappedTitles.has(col.title),
          );
          return [...mapped, ...localOnly];
        });
      })
      .catch((err) => {
        console.error("getBoards error:", err);
        setLoadError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [addAfterIndex, setAddAfterIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");

  const [confirmAction, setConfirmAction] = useState(null); // { message, onConfirm }
  const askConfirm = (message, onConfirm) =>
    setConfirmAction({ message, onConfirm });

  const [addItemColumnIndex, setAddItemColumnIndex] = useState(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemAssignees, setItemAssignees] = useState([]);
  const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);
  const [assigneeMenuUpward, setAssigneeMenuUpward] = useState(false);
  const assigneeMenuRef = useRef(null);

  const [editItem, setEditItem] = useState(null); // { columnIndex, itemId }
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemAssignees, setEditItemAssignees] = useState([]);
  const [editAssigneeMenuOpen, setEditAssigneeMenuOpen] = useState(false);
  const [editAssigneeMenuUpward, setEditAssigneeMenuUpward] = useState(false);
  const editAssigneeMenuRef = useRef(null);

  const ASSIGNEE_MENU_HEIGHT = 320; // matches max-h-80

  const toggleAssigneeMenu = () => {
    if (!assigneeMenuOpen && assigneeMenuRef.current) {
      const rect = assigneeMenuRef.current.getBoundingClientRect();
      setAssigneeMenuUpward(
        window.innerHeight - rect.bottom < ASSIGNEE_MENU_HEIGHT &&
          rect.top > ASSIGNEE_MENU_HEIGHT,
      );
    }
    setAssigneeMenuOpen((v) => !v);
  };

  const toggleEditAssigneeMenu = () => {
    if (!editAssigneeMenuOpen && editAssigneeMenuRef.current) {
      const rect = editAssigneeMenuRef.current.getBoundingClientRect();
      setEditAssigneeMenuUpward(
        window.innerHeight - rect.bottom < ASSIGNEE_MENU_HEIGHT &&
          rect.top > ASSIGNEE_MENU_HEIGHT,
      );
    }
    setEditAssigneeMenuOpen((v) => !v);
  };

  useEffect(() => {
    if (!assigneeMenuOpen) return;
    const handleClick = (e) => {
      if (!assigneeMenuRef.current?.contains(e.target)) {
        setAssigneeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [assigneeMenuOpen]);

  useEffect(() => {
    if (!editAssigneeMenuOpen) return;
    const handleClick = (e) => {
      if (!editAssigneeMenuRef.current?.contains(e.target)) {
        setEditAssigneeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [editAssigneeMenuOpen]);

  const [detailItem, setDetailItem] = useState(null); // { item, columnTitle }

  const [draggedItem, setDraggedItem] = useState(null); // { columnIndex, itemId }
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (columnIndex, itemId) => {
    setDraggedItem({ columnIndex, itemId });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const moveItemToColumn = (sourceColumnIndex, itemId, targetColumnIndex) => {
    if (sourceColumnIndex === targetColumnIndex) return;

    const sourceColumn = columns[sourceColumnIndex];
    const targetColumn = columns[targetColumnIndex];
    const movedRef = sourceColumn.boardRefs?.find(
      (ref) => ref.itemId === itemId,
    );

    // Optimistic: move it in the UI immediately, persist in the background.
    setColumns((prev) => {
      const sourceItems = prev[sourceColumnIndex].items;
      const movedItem = sourceItems.find((item) => item.id === itemId);
      if (!movedItem) return prev;

      return prev.map((col, i) => {
        if (i === sourceColumnIndex) {
          return {
            ...col,
            items: col.items.filter((item) => item.id !== movedItem.id),
            boardRefs: (col.boardRefs ?? []).filter(
              (ref) => ref.itemId !== itemId,
            ),
          };
        }
        if (i === targetColumnIndex) {
          return {
            ...col,
            items: [...col.items, movedItem],
            boardRefs: movedRef
              ? [...(col.boardRefs ?? []), movedRef]
              : (col.boardRefs ?? []),
          };
        }
        return col;
      });
    });

    if (movedRef) {
      updateBoard({
        itemId: movedRef.itemId,
        columns: [{ ColumnName: targetColumn.title, Items: movedRef.items }],
      }).catch((err) => {
        console.error("updateBoard error:", err);
      });
    }
  };

  const handleDrop = (targetColumnIndex) => {
    if (!draggedItem) {
      setDragOverIndex(null);
      return;
    }
    moveItemToColumn(
      draggedItem.columnIndex,
      draggedItem.itemId,
      targetColumnIndex,
    );
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const openAddDialog = (index) => {
    setAddAfterIndex(index);
    setAddSectionOpen(true);
  };

  const handleAddSection = async () => {
    const name = sectionName.trim();
    if (!name) return;

    let boardRefs = [];
    try {
      const result = await insertBoard({
        columns: [{ ColumnName: name, Items: [] }],
      });
      if (result?.itemId) {
        boardRefs = [{ itemId: result.itemId, items: [] }];
      }
      toast.success("Section created", {
        description: `"${name}" was added.`,
      });
    } catch (err) {
      console.error("insertBoard error:", err);
      toast.error("Failed to create section", {
        description: err.message,
      });
    }

    setColumns((prev) => {
      const insertAt = addAfterIndex === null ? prev.length : addAfterIndex + 1;
      const next = [...prev];
      next.splice(insertAt, 0, { title: name, items: [], boardRefs });
      return next;
    });
    setSectionName("");
    setAddAfterIndex(null);
    setAddSectionOpen(false);
  };

  const openEditDialog = (index) => {
    setEditingIndex(index);
    setEditName(columns[index].title);
  };

  const handleEditSave = async () => {
    const name = editName.trim();
    if (!name) return;

    const boardRefs = columns[editingIndex]?.boardRefs ?? [];
    try {
      await Promise.all(
        boardRefs.map((ref) =>
          updateBoard({
            itemId: ref.itemId,
            columns: [{ ColumnName: name, Items: ref.items }],
          }),
        ),
      );
      toast.success("Section updated", {
        description: `Renamed to "${name}".`,
      });
    } catch (err) {
      console.error("updateBoard error:", err);
      toast.error("Failed to update section", {
        description: err.message,
      });
    }

    setColumns((prev) =>
      prev.map((col, i) =>
        i === editingIndex ? { ...col, title: name } : col,
      ),
    );
    setEditingIndex(null);
  };

  const handleDeleteSection = async (index) => {
    const boardRefs = columns[index]?.boardRefs ?? [];
    try {
      await Promise.all(
        boardRefs.map((ref) => deleteBoard({ itemId: ref.itemId })),
      );
      toast.success("Section deleted");
    } catch (err) {
      console.error("deleteBoard error:", err);
      toast.error("Failed to delete section", {
        description: err.message,
      });
    }

    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const openAddItemDialog = (index) => {
    setAddItemColumnIndex(index);
    setItemTitle("");
    setItemDescription("");
    setItemAssignees([]);
    setAssigneeMenuOpen(false);
  };

  const toggleAssignee = (id) => {
    setItemAssignees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleCreateItem = async () => {
    const title = itemTitle.trim();
    if (!title) return;

    const description = itemDescription.trim();
    const columnName = columns[addItemColumnIndex]?.title ?? "";

    let itemId = crypto.randomUUID();
    try {
      const result = await insertBoard({
        columns: [
          {
            ColumnName: columnName,
            Items: [
              {
                Title: title,
                Description: description,
                Assignees: itemAssignees,
              },
            ],
          },
        ],
      });
      itemId = result?.itemId || itemId;
      toast.success("Item created", {
        description: `"${title}" was added.`,
      });
    } catch (err) {
      console.error("insertBoard error:", err);
      toast.error("Failed to create item", {
        description: err.message,
      });
    }

    setColumns((prev) =>
      prev.map((col, i) =>
        i === addItemColumnIndex
          ? {
              ...col,
              items: [
                ...col.items,
                {
                  id: itemId,
                  title,
                  description,
                  assignees: itemAssignees,
                },
              ],
              boardRefs: [
                ...(col.boardRefs ?? []),
                {
                  itemId,
                  items: [
                    {
                      Title: title,
                      Description: description,
                      Assignees: itemAssignees,
                    },
                  ],
                },
              ],
            }
          : col,
      ),
    );
    setAddItemColumnIndex(null);
  };

  const openEditItemDialog = (columnIndex, item) => {
    setEditItem({ columnIndex, itemId: item.id });
    setEditItemTitle(item.title);
    setEditItemDescription(item.description);
    setEditItemAssignees(item.assignees);
    setEditAssigneeMenuOpen(false);
  };

  const toggleEditAssignee = (id) => {
    setEditItemAssignees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleEditItemSave = async () => {
    const title = editItemTitle.trim();
    if (!title) return;

    const description = editItemDescription.trim();
    const columnName = columns[editItem.columnIndex]?.title ?? "";

    try {
      await updateBoard({
        itemId: editItem.itemId,
        columns: [
          {
            ColumnName: columnName,
            Items: [
              {
                Title: title,
                Description: description,
                Assignees: editItemAssignees,
              },
            ],
          },
        ],
      });
      toast.success("Item updated", {
        description: `"${title}" was saved.`,
      });
    } catch (err) {
      console.error("updateBoard error:", err);
      toast.error("Failed to update item", {
        description: err.message,
      });
    }

    setColumns((prev) =>
      prev.map((col, i) =>
        i === editItem.columnIndex
          ? {
              ...col,
              items: col.items.map((item) =>
                item.id === editItem.itemId
                  ? {
                      ...item,
                      title,
                      description,
                      assignees: editItemAssignees,
                    }
                  : item,
              ),
            }
          : col,
      ),
    );
    setEditItem(null);
  };

  const handleDeleteItem = async (columnIndex, itemId) => {
    try {
      await deleteBoard({ itemId });
      toast.success("Item deleted");
    } catch (err) {
      console.error("deleteBoard error:", err);
      toast.error("Failed to delete item", {
        description: err.message,
      });
    }

    setColumns((prev) =>
      prev.map((col, i) =>
        i === columnIndex
          ? {
              ...col,
              items: col.items.filter((item) => item.id !== itemId),
              boardRefs: (col.boardRefs ?? []).filter(
                (ref) => ref.itemId !== itemId,
              ),
            }
          : col,
      ),
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="-m-6 flex h-[calc(100vh-3.75rem)] items-center justify-center border-t bg-border">
          <span className="text-sm text-muted-foreground">
            Loading board…
          </span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {loadError && (
        <div className="-m-6 mb-3 border-b bg-destructive/10 px-6 py-2 text-sm text-destructive">
          Failed to load board data: {loadError}
        </div>
      )}
      <div
        className={`-m-6 flex h-[calc(100vh-3.75rem)] gap-0.75 overflow-x-auto border-t bg-border ${
          columns.length === 3 ? "justify-center" : ""
        }`}
      >
        {columns.map((column, index) => (
          <div
            key={column.title + index}
            className="group flex w-80 shrink-0 flex-col bg-background"
          >
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
                    <DropdownMenuItem onClick={() => openEditDialog(index)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        askConfirm(
                          "Are you sure you want to delete this section?",
                          () => handleDeleteSection(index),
                        )
                      }
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
                        onClick={() => openAddDialog(index)}
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
                setDragOverIndex(index);
              }}
              onDragLeave={() =>
                setDragOverIndex((i) => (i === index ? null : i))
              }
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index);
              }}
            >
              {column.items.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-grab rounded border bg-card p-4 shadow-sm transition-opacity active:cursor-grabbing ${
                    draggedItem?.itemId === item.id ? "opacity-40" : ""
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index, item.id)}
                  onDragEnd={handleDragEnd}
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
                        <DropdownMenuItem
                          onClick={() => openEditItemDialog(index, item)}
                        >
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            askConfirm(
                              "Are you sure you want to delete this item?",
                              () => handleDeleteItem(index, item.id),
                            )
                          }
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
                        setDetailItem({ item, columnTitle: column.title })
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
                      onMove={(targetIndex) =>
                        moveItemToColumn(index, item.id, targetIndex)
                      }
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
                onClick={() => openAddItemDialog(index)}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Section Name"
            autoFocus
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          />

          <DialogFooter>
            <Button onClick={handleAddSection}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingIndex !== null}
        onOpenChange={(open) => !open && setEditingIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Section Name"
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              askConfirm(
                "Are you sure you want to update this section?",
                handleEditSave,
              )
            }
          />

          <DialogFooter>
            <Button
              onClick={() =>
                askConfirm(
                  "Are you sure you want to update this section?",
                  handleEditSave,
                )
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addItemColumnIndex !== null}
        onOpenChange={(open) => !open && setAddItemColumnIndex(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-lg">
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Item</DialogTitle>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label="Close"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setAddItemColumnIndex(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                }
              />
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>

          <Input
            placeholder="Item title"
            autoFocus
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />

          <div
            ref={assigneeMenuRef}
            className="relative flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <div className="flex flex-1 -space-x-2">
              {itemAssignees.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No assignees
                </span>
              )}
              {itemAssignees.map((id) => {
                const member = TEAM_MEMBERS.find((m) => m.id === id);
                if (!member) return null;
                return (
                  <Avatar
                    key={id}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarFallback>{initialsFor(member.name)}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Add assignees"
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleAssigneeMenu}
            >
              <Plus className="h-5 w-5" />
            </button>

            {assigneeMenuOpen && (
              <div
                className={`absolute right-0 z-20 w-72 max-h-80 overflow-y-auto rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg ${
                  assigneeMenuUpward ? "bottom-full mb-2" : "top-full mt-2"
                }`}
              >
                {TEAM_MEMBERS.map((member) => (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted"
                  >
                    <Checkbox
                      className="size-5 rounded-md"
                      checked={itemAssignees.includes(member.id)}
                      onCheckedChange={() => toggleAssignee(member.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {initialsFor(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddItemColumnIndex(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateItem}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-lg">
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Item</DialogTitle>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label="Close"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setEditItem(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                }
              />
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>

          <Input
            placeholder="Item title"
            autoFocus
            value={editItemTitle}
            onChange={(e) => setEditItemTitle(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={editItemDescription}
            onChange={(e) => setEditItemDescription(e.target.value)}
          />

          <div
            ref={editAssigneeMenuRef}
            className="relative flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <div className="flex flex-1 -space-x-2">
              {editItemAssignees.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No assignees
                </span>
              )}
              {editItemAssignees.map((id) => {
                const member = TEAM_MEMBERS.find((m) => m.id === id);
                if (!member) return null;
                return (
                  <Avatar
                    key={id}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarFallback>{initialsFor(member.name)}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Edit assignees"
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleEditAssigneeMenu}
            >
              <Plus className="h-5 w-5" />
            </button>

            {editAssigneeMenuOpen && (
              <div
                className={`absolute right-0 z-20 w-72 max-h-80 overflow-y-auto rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg ${
                  editAssigneeMenuUpward ? "bottom-full mb-2" : "top-full mt-2"
                }`}
              >
                {TEAM_MEMBERS.map((member) => (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted"
                  >
                    <Checkbox
                      className="size-5 rounded-md"
                      checked={editItemAssignees.includes(member.id)}
                      onCheckedChange={() => toggleEditAssignee(member.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {initialsFor(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                askConfirm(
                  "Are you sure you want to update this item?",
                  handleEditItemSave,
                )
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {confirmAction?.message}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmAction?.onConfirm();
                setConfirmAction(null);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer
        open={detailItem !== null}
        onOpenChange={(open) => !open && setDetailItem(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{detailItem?.item.title}</DrawerTitle>
            {detailItem?.columnTitle && (
              <Badge variant="secondary" className="w-fit">
                {detailItem.columnTitle}
              </Badge>
            )}
          </DrawerHeader>

          <DrawerDescription className="text-foreground">
            {detailItem?.item.description || "No description"}
          </DrawerDescription>

          <div>
            <p className="mb-2 text-sm font-medium">Assignees</p>
            <div className="flex flex-wrap gap-2">
              {(detailItem?.item.assignees ?? []).filter((id) =>
                TEAM_MEMBERS.some((m) => m.id === id),
              ).length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No assignee
                </span>
              )}
              {detailItem?.item.assignees.map((id) => {
                const member = TEAM_MEMBERS.find((m) => m.id === id);
                if (!member) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {initialsFor(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {member.name}
                  </div>
                );
              })}
            </div>
          </div>

          {detailItem && (
            <DrawerDummyDetails item={detailItem.item} />
          )}
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}

function DrawerDummyDetails({ item }) {
  const meta = dummyMetaFor(item);

  return (
    <div className="space-y-4 border-t pt-4">
      <div>
        <p className="mb-2 text-sm font-medium">Labels</p>
        <div className="flex flex-wrap gap-1.5">
          {meta.labels.map((label) => (
            <Badge key={label.name} variant="secondary" className="gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${label.color}`} />
              {label.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-sm font-medium">Priority</p>
          <Badge variant="secondary" className="gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${meta.priority.color}`}
            />
            {meta.priority.value}
          </Badge>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Status</p>
          <Badge variant="outline">{meta.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-sm font-medium">Milestone</p>
          <span className="text-sm text-muted-foreground">
            {meta.milestone}
          </span>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Due date</p>
          <span
            className={`flex items-center gap-1 text-sm ${
              meta.dueInDays < 0
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {meta.dueInDays < 0 && <AlertTriangle className="h-3.5 w-3.5" />}
            {meta.dueDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Activity</p>
        <div className="space-y-3">
          {meta.activity.map((entry, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Circle className="mt-1 h-2 w-2 shrink-0 fill-muted-foreground text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {TEAM_MEMBERS[i % TEAM_MEMBERS.length].name}
                </span>{" "}
                {entry.verb} this card ·{" "}
                {entry.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
