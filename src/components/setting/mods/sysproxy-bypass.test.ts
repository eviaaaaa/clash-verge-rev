import { describe, expect, it } from 'vitest'

import {
  mergeDefaultBypass,
  splitBypass,
  stripDefaultBypass,
} from './sysproxy-bypass'

const defaults = ['127.0.0.1', 'localhost', '*.local']

describe('system proxy bypass mode transitions', () => {
  it('splits every supported separator and removes empty entries', () => {
    expect(splitBypass('127.0.0.1, localhost;\n*.local')).toEqual(defaults)
  })

  it('shows only genuine custom entries while defaults are enabled', () => {
    expect(
      stripDefaultBypass(
        '127.0.0.1,localhost,*.local,example.com,100.86.228.121',
        defaults,
        ',',
      ),
    ).toBe('example.com,100.86.228.121')
  })

  it('removes duplicate custom entries when normalizing the enabled mode', () => {
    expect(
      stripDefaultBypass(
        'localhost,example.com,example.com,100.86.228.121',
        defaults,
        ',',
      ),
    ).toBe('example.com,100.86.228.121')
  })

  it('restores all defaults when switching to custom-only mode', () => {
    expect(
      mergeDefaultBypass('example.com,100.86.228.121', defaults, ','),
    ).toBe('127.0.0.1,localhost,*.local,example.com,100.86.228.121')
  })

  it('does not duplicate defaults already present in the stored list', () => {
    expect(
      mergeDefaultBypass(
        'localhost,example.com,127.0.0.1,example.com',
        defaults,
        ';',
      ),
    ).toBe('127.0.0.1;localhost;*.local;example.com')
  })

  it('uses the complete safe default list when no custom entry exists', () => {
    expect(mergeDefaultBypass('', defaults, ',')).toBe(
      '127.0.0.1,localhost,*.local',
    )
  })
})
