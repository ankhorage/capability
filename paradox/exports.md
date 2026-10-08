# Public API

## areCapabilitiesEqual

Kind: `function`
Module: `src/features/capability/areCapabilitiesEqual.ts`
Source: `src/features/capability/areCapabilitiesEqual.ts:7:1`

Compare capability descriptors independently of record keys and unordered collection ordering.

### Signatures

- `(left: Capability, right: Capability) => boolean`
  - left: `Capability`
  - right: `Capability`
  - returns: `boolean`

## areCapabilityCatalogsEqual

Kind: `function`
Module: `src/features/catalog/areCapabilityCatalogsEqual.ts`
Source: `src/features/catalog/areCapabilityCatalogsEqual.ts:7:1`

Compare capability catalogs independently of authored catalog and unordered descriptor collection ordering.

### Signatures

- `(left: readonly Capability[], right: readonly Capability[]) => boolean`
  - left: `readonly Capability[]`
  - right: `readonly Capability[]`
  - returns: `boolean`

## isCapability

Kind: `function`
Module: `src/features/capability/isCapability.ts`
Source: `src/features/capability/isCapability.ts:6:1`

Validate an untrusted value as one complete portable capability descriptor.

### Signatures

- `(value: unknown) => boolean`
  - value: `unknown`
  - returns: `boolean`

## isCapabilityCatalog

Kind: `function`
Module: `src/features/catalog/isCapabilityCatalog.ts`
Source: `src/features/catalog/isCapabilityCatalog.ts:6:1`

Validate a capability catalog with complete descriptors and unique stable identifiers.

### Signatures

- `(value: unknown) => boolean`
  - value: `unknown`
  - returns: `boolean`

## isCapabilityId

Kind: `function`
Module: `src/features/capability/isCapabilityId.ts`
Source: `src/features/capability/isCapabilityId.ts:5:1`

Validate a stable dot-separated identifier for one capability.

### Signatures

- `(value: unknown) => boolean`
  - value: `unknown`
  - returns: `boolean`

## normalizeCapability

Kind: `function`
Module: `src/features/capability/normalizeCapability.ts`
Source: `src/features/capability/normalizeCapability.ts:8:1`

Return a capability with unordered access and binding-role collections sorted and deduplicated.

### Signatures

- `(capability: Capability) => Capability`
  - capability: `Capability`
  - returns: `Capability`

## normalizeCapabilityCatalog

Kind: `function`
Module: `src/features/catalog/normalizeCapabilityCatalog.ts`
Source: `src/features/catalog/normalizeCapabilityCatalog.ts:6:1`

Normalize trusted catalog descriptors and sort them by stable capability identifier.

### Signatures

- `(catalog: readonly Capability[]) => readonly Capability[]`
  - catalog: `readonly Capability[]`
  - returns: `readonly Capability[]`

## parseCapability

Kind: `function`
Module: `src/features/capability/parseCapability.ts`
Source: `src/features/capability/parseCapability.ts:27:1`

Parse one complete portable capability descriptor from an untrusted value.

### Signatures

- `(value: unknown) => Capability | null`
  - value: `unknown`
  - returns: `Capability | null`

## parseCapabilityCatalog

Kind: `function`
Module: `src/features/catalog/parseCapabilityCatalog.ts`
Source: `src/features/catalog/parseCapabilityCatalog.ts:6:1`

Parse a capability catalog and reject invalid descriptors or duplicate stable identifiers.

### Signatures

- `(value: unknown) => readonly Capability[] | null`
  - value: `unknown`
  - returns: `readonly Capability[] | null`
