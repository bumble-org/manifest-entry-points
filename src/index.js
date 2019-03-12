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
  options,
) => {
  const values = flattenObject(manifest)
  const unique = dedupe(values)

  return siftByPredObj(options, unique)
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
  { filter = () => true, transform = x => x, ...predObj },
  values,
) => {
  const filtered = values.filter(filter)
  const rejected = values.filter(v => !filter(v))

  const [sifted, remainder] = Object.entries(predObj).reduce(
    ([resultObj, remainingValues], [key, predFn]) => [
      {
        ...resultObj,
        [key]: remainingValues
          .filter(v => predFn(v))
          .map(transform),
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
