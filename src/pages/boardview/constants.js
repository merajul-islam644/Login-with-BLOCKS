export const STATUS_COLORS = {
  Online: "bg-emerald-500",
  Away: "bg-amber-500",
  Offline: "bg-muted-foreground",
};

export const TEAM_MEMBERS = [
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

export const defaultColumns = [
  { title: "To Do", items: [], boardRefs: [] },
  { title: "In Progress", items: [], boardRefs: [] },
  { title: "Completed", items: [], boardRefs: [] },
];

export const DUMMY_LABEL_POOL = [
  { name: "bug", color: "bg-red-500" },
  { name: "feature", color: "bg-blue-500" },
  { name: "enhancement", color: "bg-purple-500" },
  { name: "documentation", color: "bg-emerald-500" },
  { name: "good first issue", color: "bg-teal-500" },
];
export const DUMMY_PRIORITY_POOL = [
  { value: "Low", color: "bg-slate-400" },
  { value: "Medium", color: "bg-amber-500" },
  { value: "High", color: "bg-red-500" },
];
export const DUMMY_STATUS_POOL = ["Todo", "In Review", "Blocked", "Ready"];
export const DUMMY_MILESTONE_POOL = [
  "v1.0 Launch",
  "Sprint 12",
  "Backlog",
  "Q3 Cleanup",
];
export const DUMMY_ACTIVITY_VERBS = [
  "opened this",
  "added a comment on",
  "moved",
  "labeled",
];
