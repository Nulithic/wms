export function filterByOperator(value: any, filterValue: string, operator: string): boolean {
  // Handle null/undefined values
  if (value == null) {
    return operator === "is blank" || operator === "is not" || operator === "is not blank";
  }

  const stringValue = String(value).toLowerCase();
  const filterString = filterValue.toLowerCase();

  switch (operator) {
    case "starts with":
      return stringValue.startsWith(filterString);
    case "contains":
      return stringValue.includes(filterString);
    case "does not contain":
      return !stringValue.includes(filterString);
    case "is":
      return stringValue === filterString;
    case "is not":
      return stringValue !== filterString;
    case "is blank":
      return !stringValue.trim();
    case "is not blank":
      return stringValue.trim().length > 0;
    default:
      return false;
  }
}
