import type { Capability } from '@ankhorage/contracts/capability';
import { describe, expect, test } from 'bun:test';

import {
  areCapabilitiesEqual,
  areCapabilityCatalogsEqual,
  isCapability,
  isCapabilityCatalog,
  isCapabilityId,
  normalizeCapability,
  normalizeCapabilityCatalog,
  parseCapability,
  parseCapabilityCatalog,
} from '../src/index.js';

const CAPABILITY = {
  id: 'storage.upload',
  owner: '@ankhorage/storage',
  access: ['write', 'read'],
  binding: { kind: 'api', bindableAs: ['target', 'source'] },
  input: { schema: { type: 'object', required: ['path'] } },
} as const satisfies Capability;

describe('capability descriptors', () => {
  test('validates and parses canonical identifiers and descriptors', () => {
    expect(isCapabilityId('storage.upload')).toBeTrue();
    expect(isCapabilityId('storage')).toBeFalse();
    expect(isCapabilityId('storage.')).toBeFalse();
    expect(isCapability(CAPABILITY)).toBeTrue();
    expect(parseCapability(CAPABILITY)).toEqual(CAPABILITY);
  });

  test('rejects incomplete descriptors and invalid nested schema values', () => {
    expect(parseCapability({ ...CAPABILITY, binding: undefined })).toBeNull();
    expect(parseCapability({ ...CAPABILITY, access: ['delete'] })).toBeNull();
    expect(parseCapability({ ...CAPABILITY, input: { schema: { type: 'date' } } })).toBeNull();
    expect(parseCapability({ ...CAPABILITY, output: { schemaRef: { id: '' } } })).toBeNull();
  });

  test('normalizes unordered descriptor collections and compares structurally', () => {
    const normalized = normalizeCapability(CAPABILITY);
    const equivalent = {
      ...CAPABILITY,
      access: ['read', 'write'],
      binding: { kind: 'api', bindableAs: ['source', 'target'] },
    } as const satisfies Capability;

    expect(normalized.access).toEqual(['read', 'write']);
    expect(normalized.binding.bindableAs).toEqual(['source', 'target']);
    expect(areCapabilitiesEqual(CAPABILITY, equivalent)).toBeTrue();
    expect(
      areCapabilitiesEqual(CAPABILITY, { ...equivalent, owner: '@ankhorage/runtime' }),
    ).toBeFalse();
  });
});

describe('capability catalogs', () => {
  test('rejects invalid and duplicate stable identifiers', () => {
    expect(
      parseCapabilityCatalog([CAPABILITY, { ...CAPABILITY, owner: '@ankhorage/runtime' }]),
    ).toBeNull();
    expect(
      parseCapabilityCatalog([CAPABILITY, { ...CAPABILITY, id: 'storage.download' }]),
    ).not.toBeNull();
    expect(isCapabilityCatalog([CAPABILITY, { ...CAPABILITY, access: ['delete'] }])).toBeFalse();
  });

  test('normalizes and compares catalogs independently of catalog order', () => {
    const secondCapability = {
      ...CAPABILITY,
      id: 'storage.download',
    } as const satisfies Capability;
    const catalog = [CAPABILITY, secondCapability] as const;

    expect(normalizeCapabilityCatalog(catalog).map((capability) => capability.id)).toEqual([
      'storage.download',
      'storage.upload',
    ]);
    expect(areCapabilityCatalogsEqual(catalog, [secondCapability, CAPABILITY])).toBeTrue();
  });
});
