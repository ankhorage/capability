import type { Capability } from '@ankhorage/contracts/capability';
import { isNonEmptyString } from '@ankhorage/utility/string';

/*** Validate a stable dot-separated identifier for one capability. */
export function isCapabilityId(value: unknown): value is Capability['id'] {
  return (
    isNonEmptyString(value) &&
    value.split('.').length >= 2 &&
    value.split('.').every(isNonEmptyString)
  );
}
