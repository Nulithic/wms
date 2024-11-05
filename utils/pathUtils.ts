export const pathUtils = {
  clean: (path: string): string => {
    // Remove leading and trailing slashes
    return path.replace(/^\/+|\/+$/g, "");
  },

  combine: (...paths: string[]): string => {
    // Filter out empty strings and clean each path
    const cleanPaths = paths.filter(Boolean).map((path) => pathUtils.clean(path));

    // Join with single slashes and add leading slash
    return cleanPaths.length > 0 ? `/${cleanPaths.join("/")}` : "/";
  },

  addLeadingSlash: (path: string): string => {
    return path ? (path.startsWith("/") ? path : `/${path}`) : "/";
  },

  removeLeadingSlash: (path: string): string => {
    return path.replace(/^\/+/, "");
  },
};
