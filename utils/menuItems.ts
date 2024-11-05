export const userItems = [
  { title: "Home", path: "/", subItems: [], hasSubItems: false },
  {
    title: "Admin",
    path: "",
    subItems: [
      { title: "Users", path: "/admin/users", subItems: [], hasSubItems: false },
      { title: "Groups", path: "/admin/groups", subItems: [], hasSubItems: false },
      { title: "Menu Items", path: "/admin/menu-items", subItems: [], hasSubItems: false },
    ],
    hasSubItems: true,
  },
];
