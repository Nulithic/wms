type UserItem = {
  title: string;
  path: string;
  subItems: UserItem[];
  hasSubItems: boolean;
};

export const getTitleFromPath = (items: UserItem[], path: string): string => {
  for (const item of items) {
    if (item.path === path) {
      return item.title;
    }
    if (item.hasSubItems && item.subItems.length > 0) {
      const subItemTitle = getTitleFromPath(item.subItems, path);
      if (subItemTitle) {
        return subItemTitle;
      }
    }
  }
  return "";
};
