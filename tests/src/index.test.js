import { deriveEntries } from '../../src/index'
import { flattenObject } from '../../src/index'
import { siftByPredObj } from '../../src/index'
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
    expect(result.js.length).toBe(4)
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
    expect(result.img.length).toBe(3)
  })
})

describe('flattenObject', () => {
  test('gets all primitive', () => {
    const result = flattenObject(manifestTiny)

    expect(result).toBeInstanceOf(Array)
    //author is a key and should be flattened!
    expect(result).not.toContain('author')
    expect(result).toContain('background.js')
    expect(result).toContain(false)
  })
})

describe('siftByPredObj', () => {
  test('works with default predObj', () => {
    const predObj = {
      js: s => /\.js$/.test(s),
      css: s => /\.css$/.test(s),
      html: s => /\.html$/.test(s),
      img: s => /\.png$/.test(s),
      filter: v =>
        typeof v === 'string' &&
        v.includes('.') &&
        !v.includes('*') &&
        !/^https?:/.test(v),
    }

    const strings = flattenObject(manifestTiny)
    const result = siftByPredObj(predObj, strings)

    const expObject = {
      css: [],
      html: [],
      img: [
        'images/clip64-icon-16.png',
        'images/clip64-icon-48.png',
        'images/clip64-icon-128.png',
        'images/clip64-icon-16.png',
      ],
      js: ['background.js'],
      remainder: [
        '0.5.1',
        'Decode Base64 to the clipboard.',
        'Jack and Amy Steam <jacksteamdev@gmail.com>',
      ],
      rejected: [
        'contextMenus',
        'notifications',
        false,
        2,
        'Clip64 Base64 Decoder',
        'Clip64',
      ],
    }

    expect(result).toEqual(expObject)
  })
})
