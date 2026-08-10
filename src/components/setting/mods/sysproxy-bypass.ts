export const splitBypass = (value?: string) =>
  (value ?? '')
    .split(/[,\n;\r]+/)
    .map((item) => item.trim())
    .filter(Boolean)

const uniqueBypass = (items: string[]) => [...new Set(items)]

export const stripDefaultBypass = (
  value: string | undefined,
  defaults: string[],
  separator: string,
) => {
  const defaultSet = new Set(defaults)
  return uniqueBypass(splitBypass(value))
    .filter((item) => !defaultSet.has(item))
    .join(separator)
}

export const mergeDefaultBypass = (
  value: string | undefined,
  defaults: string[],
  separator: string,
) => {
  const defaultSet = new Set(defaults)
  const customItems = uniqueBypass(splitBypass(value)).filter(
    (item) => !defaultSet.has(item),
  )
  return uniqueBypass([...defaults, ...customItems]).join(separator)
}
