import dedupe from 'dedupe'

export const deriveEntries = (
  {
    manifest_version,
    name,
    version,
    description,
    author,
    short_name,
    permissions,
    content_security_policy,
    ...manifest
  },
  predObj = {
    js: s => /\.js$/.test(s),
    css: s => /\.css$/.test(s),
    html: s => /\.html$/.test(s),
    img: s => /\.png$/.test(s),
    filter: v =>
      typeof v === 'string' &&
      v.includes('.') &&
      !v.includes('*') &&
      !/^https?:/.test(v),
  },
) => {
  const values = flattenObject(manifest)
  const unique = dedupe(values)

  return siftByPredObj(predObj, unique)
}

export const flattenObject = obj =>
  Object.values(obj).reduce((primitivesArray, objValue) => {
    if (typeof objValue !== 'object') {
      return [...primitivesArray, objValue]
    } else {
      return [...flattenObject(objValue), ...primitivesArray]
    }
  }, [])

export const siftByPredObj = (
  { filter = () => true, ...predObj },
  values,
) => {
  const filtered = values.filter(filter)
  const rejected = values.filter(v => !filter(v))

  const [sifted, remainder] = Object.entries(predObj).reduce(
    ([resultObj, remainingValues], [key, predFn]) => [
      {
        ...resultObj,
        [key]: remainingValues.filter(v => predFn(v)),
      },
      remainingValues.filter(v => !predFn(v)),
    ],
    [{}, filtered],
  )

  return {
    ...sifted,
    rejected,
    remainder,
  }
}
