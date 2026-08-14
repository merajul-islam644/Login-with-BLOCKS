import {
  defaultColumns,
  DUMMY_ACTIVITY_VERBS,
  DUMMY_LABEL_POOL,
  DUMMY_MILESTONE_POOL,
  DUMMY_PRIORITY_POOL,
  DUMMY_STATUS_POOL,
} from "./constants";

export function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// boardRefs tracks, per column, which backend board records (and their exact
// Items payload) back that column — needed so renaming a column can push the
// new ColumnName to every board record that contains it without clobbering
// items that belong to a different board record.
export function mapBoardsToColumns(boardItems) {
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
export function dummyMetaFor(item) {
  const hash = hashString(item.id || item.title || "");
  const labelCount = (hash % 3) + 1;
  const labels = Array.from({ length: labelCount }, (_, i) =>
    DUMMY_LABEL_POOL[(hash + i * 7) % DUMMY_LABEL_POOL.length],
  );
  const priority = DUMMY_PRIORITY_POOL[hash % DUMMY_PRIORITY_POOL.length];
  const status = DUMMY_STATUS_POOL[(hash >> 2) % DUMMY_STATUS_POOL.length];
  const milestone =
    DUMMY_MILESTONE_POOL[(hash >> 4) % DUMMY_MILESTONE_POOL.length];
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
