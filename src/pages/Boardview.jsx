import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { deleteBoard, getBoards, insertBoard, updateBoard } from "@/api/boards";
import { toast } from "@/components/ui/toast";
import { defaultColumns } from "@/pages/boardview/constants";
import { mapBoardsToColumns } from "@/pages/boardview/utils";
import { BoardColumn } from "@/pages/boardview/BoardColumn";
import { ItemDetailDrawer } from "@/pages/boardview/ItemDetailDrawer";
import {
  AddItemDialog,
  AddSectionDialog,
  ConfirmDialog,
  EditItemDialog,
  EditSectionDialog,
} from "@/pages/boardview/BoardDialogs";

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
          const localOnly = prev.filter((col) => !mappedTitles.has(col.title));
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

  const [editItem, setEditItem] = useState(null); // { columnIndex, itemId }
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemAssignees, setEditItemAssignees] = useState([]);

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
      prev.map((col, i) => (i === editingIndex ? { ...col, title: name } : col)),
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
                  ? { ...item, title, description, assignees: editItemAssignees }
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
          <span className="text-sm text-muted-foreground">Loading board…</span>
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
          <BoardColumn
            key={column.title + index}
            column={column}
            index={index}
            columns={columns}
            dragOverIndex={dragOverIndex}
            draggedItem={draggedItem}
            onEditSection={openEditDialog}
            onDeleteSection={(idx) =>
              askConfirm(
                "Are you sure you want to delete this section?",
                () => handleDeleteSection(idx),
              )
            }
            onAddSection={openAddDialog}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOverColumn={setDragOverIndex}
            onDragLeaveColumn={(idx) =>
              setDragOverIndex((i) => (i === idx ? null : i))
            }
            onDropColumn={handleDrop}
            onOpenItemDetail={setDetailItem}
            onAddItem={openAddItemDialog}
            onEditItem={openEditItemDialog}
            onDeleteItem={(idx, itemId) =>
              askConfirm(
                "Are you sure you want to delete this item?",
                () => handleDeleteItem(idx, itemId),
              )
            }
            onMoveItem={moveItemToColumn}
          />
        ))}
      </div>

      <AddSectionDialog
        open={addSectionOpen}
        onOpenChange={setAddSectionOpen}
        sectionName={sectionName}
        onSectionNameChange={setSectionName}
        onSave={handleAddSection}
      />

      <EditSectionDialog
        open={editingIndex !== null}
        onOpenChange={(open) => !open && setEditingIndex(null)}
        editName={editName}
        onEditNameChange={setEditName}
        onConfirmSave={() =>
          askConfirm(
            "Are you sure you want to update this section?",
            handleEditSave,
          )
        }
      />

      <AddItemDialog
        open={addItemColumnIndex !== null}
        onOpenChange={(open) => !open && setAddItemColumnIndex(null)}
        itemTitle={itemTitle}
        onItemTitleChange={setItemTitle}
        itemDescription={itemDescription}
        onItemDescriptionChange={setItemDescription}
        itemAssignees={itemAssignees}
        onToggleAssignee={toggleAssignee}
        onCancel={() => setAddItemColumnIndex(null)}
        onCreate={handleCreateItem}
      />

      <EditItemDialog
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
        itemTitle={editItemTitle}
        onItemTitleChange={setEditItemTitle}
        itemDescription={editItemDescription}
        onItemDescriptionChange={setEditItemDescription}
        itemAssignees={editItemAssignees}
        onToggleAssignee={toggleEditAssignee}
        onCancel={() => setEditItem(null)}
        onConfirmSave={() =>
          askConfirm(
            "Are you sure you want to update this item?",
            handleEditItemSave,
          )
        }
      />

      <ConfirmDialog
        confirmAction={confirmAction}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          confirmAction?.onConfirm();
          setConfirmAction(null);
        }}
      />

      <ItemDetailDrawer
        detailItem={detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
      />
    </AppLayout>
  );
}
