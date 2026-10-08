import type { Capability } from '@ankhorage/contracts/capability';

import { normalizeCapability } from '../capability/normalizeCapability.js';

/*** Normalize trusted catalog descriptors and sort them by stable capability identifier. */
export function normalizeCapabilityCatalog(catalog: readonly Capability[]): readonly Capability[] {
  return catalog
    .map(normalizeCapability)
    .toSorted((left, right) => left.id.localeCompare(right.id));
}
