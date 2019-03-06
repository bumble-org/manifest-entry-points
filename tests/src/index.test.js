import { deriveEntries } from '../../src/index'
import { flattenObject } from '../../src/index'
import manifest from '../sample_manifests/manifest-all.json'
import manifestTiny from '../sample_manifests/manifest-1.json'

describe('deriveEntries', () => {
  const result = deriveEntries(manifest)

  test('returns correct api', () => {
    expect(result.js).toBeDefined()
    expect(result.js).toBeInstanceOf(Array)
    expect(result.css).toBeDefined()
    expect(result.css).toBeInstanceOf(Array)
    expect(result.html).toBeDefined()
    expect(result.html).toBeInstanceOf(Array)
    expect(result.img).toBeDefined()
    expect(result.img).toBeInstanceOf(Array)
  })
  test('gets all js', () => {
    expect(result.js).toContain(
      'background/chrome.message.bg.js',
    )
    expect(result.js).toContain('background/init.bg.js')
    expect(result.js).toContain('content/state.ct.js')
    expect(result.js).toContain('utils/web.interval.js')
  })

  test('gets all css', () => {
    expect(result.css).toContain('content/styles.ct.css')
  })

  test('gets all html', () => {
    expect(result.html).toContain('options/options.html')
  })

  test('gets all images', () => {
    expect(result.img).toContain('icon-16.png')
    expect(result.img).toContain('icon-48.png')
    expect(result.img).toContain('icon-128.png')
  })
})

describe('flattenObject', () => {
  test('gets all primitive', () => {
    const result = flattenObject(manifestTiny)

    expect(result).toBeInstanceOf(Array)
    expect(result).not.toContain('author')
    expect(result).toContain('background.js')
    expect(result).toContain(false)
  })
})
