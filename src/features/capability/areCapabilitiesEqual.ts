import type { Capability } from '@ankhorage/contracts/capability';
import { isDeepEqual } from '@ankhorage/utility/object';

import { normalizeCapability } from './normalizeCapability.js';

/*** Compare capability descriptors independently of record keys and unordered collection ordering. */
export function areCapabilitiesEqual(left: Capability, right: Capability): boolean {
  return isDeepEqual(normalizeCapability(left), normalizeCapability(right));
}
