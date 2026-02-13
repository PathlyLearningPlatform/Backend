export function getColumnsFromUniqueConstraint(constraint: string): string[] {
  const items = constraint.split('_')

  return items.slice(1, items.length - 1)
}