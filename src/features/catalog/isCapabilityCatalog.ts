import type { Capability } from '@ankhorage/contracts/capability';

import { parseCapabilityCatalog } from './parseCapabilityCatalog.js';

/*** Validate a capability catalog with complete descriptors and unique stable identifiers. */
export function isCapabilityCatalog(value: unknown): value is readonly Capability[] {
  return parseCapabilityCatalog(value) !== null;
}
