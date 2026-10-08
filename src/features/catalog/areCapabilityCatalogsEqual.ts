import type { Capability } from '@ankhorage/contracts/capability';
import { isDeepEqual } from '@ankhorage/utility/object';

import { normalizeCapabilityCatalog } from './normalizeCapabilityCatalog.js';

/*** Compare capability catalogs independently of authored catalog and unordered descriptor collection ordering. */
export function areCapabilityCatalogsEqual(
  left: readonly Capability[],
  right: readonly Capability[],
): boolean {
  return isDeepEqual(normalizeCapabilityCatalog(left), normalizeCapabilityCatalog(right));
}
