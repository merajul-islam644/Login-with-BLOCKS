import { AlertTriangle, Circle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TEAM_MEMBERS } from "./constants";
import { dummyMetaFor, initialsFor } from "./utils";

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
              meta.dueInDays < 0 ? "text-destructive" : "text-muted-foreground"
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

export function ItemDetailDrawer({ detailItem, onOpenChange }) {
  return (
    <Drawer open={detailItem !== null} onOpenChange={onOpenChange}>
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

        {detailItem && <DrawerDummyDetails item={detailItem.item} />}
      </DrawerContent>
    </Drawer>
  );
}
