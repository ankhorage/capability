import type { Capability } from '@ankhorage/contracts/capability';

import { parseCapability } from './parseCapability.js';

/*** Validate an untrusted value as one complete portable capability descriptor. */
export function isCapability(value: unknown): value is Capability {
  return parseCapability(value) !== null;
}
