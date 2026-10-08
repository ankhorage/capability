import type { Capability } from '@ankhorage/contracts/capability';
import { uniqueSortedStrings } from '@ankhorage/utility/array';

const CAPABILITY_ACCESS: readonly string[] = ['emit', 'invoke', 'read', 'subscribe', 'write'];
const CAPABILITY_BINDING_ROLES: readonly string[] = ['source', 'target'];

/*** Return a capability with unordered access and binding-role collections sorted and deduplicated. */
export function normalizeCapability(capability: Capability): Capability {
  return {
    id: capability.id,
    owner: capability.owner,
    access: uniqueSortedStrings(capability.access).filter(isCapabilityAccess),
    binding: {
      kind: capability.binding.kind,
      bindableAs: uniqueSortedStrings(capability.binding.bindableAs).filter(
        isCapabilityBindingRole,
      ),
    },
    ...(capability.label === undefined ? {} : { label: capability.label }),
    ...(capability.description === undefined ? {} : { description: capability.description }),
    ...(capability.input === undefined ? {} : { input: capability.input }),
    ...(capability.output === undefined ? {} : { output: capability.output }),
  };
}

/*** Retain one known portable capability access operation after generic string normalization. */
function isCapabilityAccess(value: string): value is Capability['access'][number] {
  return CAPABILITY_ACCESS.includes(value);
}

/*** Retain one known portable capability binding direction after generic string normalization. */
function isCapabilityBindingRole(
  value: string,
): value is Capability['binding']['bindableAs'][number] {
  return CAPABILITY_BINDING_ROLES.includes(value);
}
