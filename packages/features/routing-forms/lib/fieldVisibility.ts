/**
 * Conditional field visibility for Routing Forms.
 *
 * A field is considered "visible" when all of its `visibleIf` conditions are met
 * based on the current form response. Fields without conditions are always visible.
 *
 * Shared by the client (FormInputFields) and the server (handleResponse) so that
 * hidden fields are excluded from both rendering and required-field validation.
 */

export type VisibleIfField = {
  id: string;
  visibleIf?: { field: string; operator: "equals" | "not_equals"; value: string }[];
};

export type VisibleIfResponse = Record<
  string,
  { value: string | number | string[]; label?: string; identifier?: string }
>;

export function isFieldVisible(field: VisibleIfField, response: VisibleIfResponse): boolean {
  const conditions = field.visibleIf;
  if (!conditions?.length) return true;

  for (const condition of conditions) {
    const answer = response[condition.field]?.value;
    const matches = typeof answer === "string" && answer === condition.value;
    if (condition.operator === "equals" && !matches) return false;
    if (condition.operator === "not_equals" && matches) return false;
  }
  return true;
}