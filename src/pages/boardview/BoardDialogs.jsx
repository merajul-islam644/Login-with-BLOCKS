import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AssigneePicker } from "./AssigneePicker";

export function AddSectionDialog({
  open,
  onOpenChange,
  sectionName,
  onSectionNameChange,
  onSave,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Section Name"
          autoFocus
          value={sectionName}
          onChange={(e) => onSectionNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
        />

        <DialogFooter>
          <Button onClick={onSave}>Add Section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditSectionDialog({
  open,
  onOpenChange,
  editName,
  onEditNameChange,
  onConfirmSave,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Section Name"
          autoFocus
          value={editName}
          onChange={(e) => onEditNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onConfirmSave()}
        />

        <DialogFooter>
          <Button onClick={onConfirmSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddItemDialog({
  open,
  onOpenChange,
  itemTitle,
  onItemTitleChange,
  itemDescription,
  onItemDescriptionChange,
  itemAssignees,
  onToggleAssignee,
  onCancel,
  onCreate,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  onClick={onCancel}
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
          onChange={(e) => onItemTitleChange(e.target.value)}
        />

        <Input
          placeholder="Description"
          value={itemDescription}
          onChange={(e) => onItemDescriptionChange(e.target.value)}
        />

        <AssigneePicker selected={itemAssignees} onToggle={onToggleAssignee} />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditItemDialog({
  open,
  onOpenChange,
  itemTitle,
  onItemTitleChange,
  itemDescription,
  onItemDescriptionChange,
  itemAssignees,
  onToggleAssignee,
  onCancel,
  onConfirmSave,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  onClick={onCancel}
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
          onChange={(e) => onItemTitleChange(e.target.value)}
        />

        <Input
          placeholder="Description"
          value={itemDescription}
          onChange={(e) => onItemDescriptionChange(e.target.value)}
        />

        <AssigneePicker
          selected={itemAssignees}
          onToggle={onToggleAssignee}
          label="Edit assignees"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirmSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({ confirmAction, onCancel, onConfirm }) {
  return (
    <Dialog
      open={confirmAction !== null}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogTitle>Are you sure?</DialogTitle>
        <p className="text-sm text-muted-foreground">
          {confirmAction?.message}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
