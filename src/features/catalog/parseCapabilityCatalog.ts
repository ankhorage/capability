import type { Capability } from '@ankhorage/contracts/capability';

import { parseCapability } from '../capability/parseCapability.js';

/*** Parse a capability catalog and reject invalid descriptors or duplicate stable identifiers. */
export function parseCapabilityCatalog(value: unknown): readonly Capability[] | null {
  if (!Array.isArray(value)) return null;

  const capabilities = value.map(parseCapability);
  if (capabilities.some((capability) => capability === null)) return null;

  const parsedCapabilities = capabilities.filter(
    (capability): capability is Capability => capability !== null,
  );
  const ids = new Set(parsedCapabilities.map((capability) => capability.id));

  return ids.size === parsedCapabilities.length ? parsedCapabilities : null;
}
