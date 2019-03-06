export const deriveEntries = ({
  manifest_version,
  name,
  version,
  description,
  author,
  short_name,
  permissions,
  content_security_policy,
  ...manifest
}) => {
  const values = flattenObject(manifest)
  const strings = values
    .filter(v => typeof v === 'string')
    .filter(s => !/^http/.test(s)) //skips websites
    .filter(s => !s.includes('*')) //skips globs

  const js = strings.filter(s => /\.js$/.test(s))
  const css = strings.filter(s => /\.css$/.test(s))
  const html = strings.filter(s => /\.html$/.test(s))
  const img = strings.filter(s => /\.png$/.test(s))

  return {
    js,
    css,
    html,
    img,
  }
}

export const flattenObject = obj =>
  Object.values(obj).reduce((primitivesArray, objValue) => {
    if (typeof objValue !== 'object') {
      return [...primitivesArray, objValue]
    } else {
      return [...flattenObject(objValue), ...primitivesArray]
    }
  }, [])
