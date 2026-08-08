/**
 * Returns the comparison form used to identify equivalent category names.
 * Examples: "Televisions" and " television " -> "television".
 */
export function normalizeCategoryName(value: string) {
  // Ignore capitalization, spaces, hyphens, plus signs, ampersands, and
  // other separators so names such as "Black+Decker" and "Black-Decker"
  // compare as the same name.
  const name = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  if (name.endsWith("ies") && name.length > 3) return `${name.slice(0, -3)}y`;
  if (/(ses|xes|zes|ches|shes)$/.test(name)) return name.slice(0, -2);
  if (name.endsWith("s") && !name.endsWith("ss") && name.length > 2) {
    return name.slice(0, -1);
  }

  return name;
}
