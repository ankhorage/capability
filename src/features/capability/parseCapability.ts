import type {
  Capability,
  CapabilityAccess,
  CapabilityBindingKind,
  CapabilityBindingRole,
} from '@ankhorage/contracts/capability';
import { isRecord, readOwnProperty } from '@ankhorage/utility/object';
import { isNonEmptyString, isOptionalString } from '@ankhorage/utility/string';

import { isCapabilityId } from './isCapabilityId.js';

const CAPABILITY_ACCESS: readonly string[] = ['emit', 'invoke', 'read', 'subscribe', 'write'];
const CAPABILITY_BINDING_KINDS: readonly string[] = [
  'action',
  'api',
  'auth',
  'authorization',
  'context',
  'event',
  'permission',
  'state',
  'storage',
];
const CAPABILITY_BINDING_ROLES: readonly string[] = ['source', 'target'];

/*** Parse one complete portable capability descriptor from an untrusted value. */
export function parseCapability(value: unknown): Capability | null {
  if (!isRecord(value)) return null;
  if (!isCapabilityId(value.id) || !isNonEmptyString(value.owner)) return null;
  if (!isCapabilityAccessList(value.access) || !isCapabilityBinding(value.binding)) return null;
  if (!isOptionalString(value.label) || !isOptionalString(value.description)) return null;
  if (!isOptionalDataSchemaSlot(value.input) || !isOptionalDataSchemaSlot(value.output))
    return null;

  return {
    id: value.id,
    owner: value.owner,
    access: value.access,
    binding: value.binding,
    ...(value.label === undefined ? {} : { label: value.label }),
    ...(value.description === undefined ? {} : { description: value.description }),
    ...(value.input === undefined ? {} : { input: value.input }),
    ...(value.output === undefined ? {} : { output: value.output }),
  };
}

/*** Validate a non-empty list of supported capability access operations. */
function isCapabilityAccessList(value: unknown): value is readonly CapabilityAccess[] {
  return Array.isArray(value) && value.length > 0 && value.every(isCapabilityAccess);
}

/*** Validate one supported capability access operation. */
function isCapabilityAccess(value: unknown): value is CapabilityAccess {
  return typeof value === 'string' && CAPABILITY_ACCESS.includes(value);
}

/*** Validate the portable binding shape attached to a capability descriptor. */
function isCapabilityBinding(value: unknown): value is Capability['binding'] {
  return (
    isRecord(value) &&
    isCapabilityBindingKind(value.kind) &&
    Array.isArray(value.bindableAs) &&
    value.bindableAs.every(isCapabilityBindingRole)
  );
}

/*** Validate one supported portable capability binding family. */
function isCapabilityBindingKind(value: unknown): value is CapabilityBindingKind {
  return typeof value === 'string' && CAPABILITY_BINDING_KINDS.includes(value);
}

/*** Validate one supported capability binding direction. */
function isCapabilityBindingRole(value: unknown): value is CapabilityBindingRole {
  return typeof value === 'string' && CAPABILITY_BINDING_ROLES.includes(value);
}

/*** Validate an omitted or structurally valid portable data-schema slot. */
function isOptionalDataSchemaSlot(value: unknown): value is Capability['input'] {
  return value === undefined || isDataSchemaSlot(value);
}

/*** Validate one portable data-schema slot without importing an executable Contracts helper. */
function isDataSchemaSlot(value: unknown): value is NonNullable<Capability['input']> {
  return (
    isRecord(value) &&
    (value.schema === undefined || isDataSchema(value.schema)) &&
    (value.schemaRef === undefined || isDataSchemaRef(value.schemaRef))
  );
}

/*** Validate the serializable recursive data-schema shape used by capability slots. */
function isDataSchema(value: unknown): boolean {
  return (
    isRecord(value) &&
    isDataSchemaMetadata(value) &&
    isDataSchemaStructure(value) &&
    isDataSchemaValues(value)
  );
}

/*** Validate descriptive and object-shape metadata for one data schema. */
function isDataSchemaMetadata(value: Record<string, unknown>): boolean {
  return (
    isOptionalDataSchemaType(value.type) &&
    isOptionalString(value.title) &&
    isOptionalString(value.description) &&
    isOptionalString(value.format) &&
    (value.nullable === undefined || typeof value.nullable === 'boolean') &&
    isOptionalStringArray(value.required) &&
    isOptionalDataSchemaProperties(value.properties) &&
    isOptionalAdditionalProperties(value.additionalProperties)
  );
}

/*** Validate recursive composition and reference fields for one data schema. */
function isDataSchemaStructure(value: Record<string, unknown>): boolean {
  return (
    (value.items === undefined || isDataSchema(value.items)) &&
    isOptionalDataSchemaComposition(value) &&
    (value.ref === undefined || isDataSchemaRef(value.ref))
  );
}

/*** Validate serializable constant, default, and enum fields for one data schema. */
function isDataSchemaValues(value: Record<string, unknown>): boolean {
  return (
    isOptionalSerializableValue(value.const) &&
    isOptionalSerializableValue(value.default) &&
    isOptionalSerializableValueArray(value.enum)
  );
}

/*** Validate an omitted data-schema type or supported primitive type declaration. */
function isOptionalDataSchemaType(value: unknown): boolean {
  const dataSchemaTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
  return (
    value === undefined ||
    (typeof value === 'string' && dataSchemaTypes.includes(value)) ||
    (Array.isArray(value) &&
      value.every((entry) => typeof entry === 'string' && dataSchemaTypes.includes(entry)))
  );
}

/*** Validate an omitted array of required property names. */
function isOptionalStringArray(value: unknown): boolean {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((entry) => typeof entry === 'string'))
  );
}

/*** Validate an omitted map of nested data schemas. */
function isOptionalDataSchemaProperties(value: unknown): boolean {
  return value === undefined || (isRecord(value) && Object.values(value).every(isDataSchema));
}

/*** Validate an omitted additional-properties declaration. */
function isOptionalAdditionalProperties(value: unknown): boolean {
  return value === undefined || typeof value === 'boolean' || isDataSchema(value);
}

/*** Validate optional schema intersections and alternatives from own properties only. */
function isOptionalDataSchemaComposition(value: Record<string, unknown>): boolean {
  return ['allOf', 'anyOf', 'oneOf'].every((key) =>
    isOptionalDataSchemaArray(readOwnProperty(value, key)),
  );
}

/*** Validate an omitted recursive data-schema collection. */
function isOptionalDataSchemaArray(value: unknown): boolean {
  return value === undefined || (Array.isArray(value) && value.every(isDataSchema));
}

/*** Validate a schema reference with the portable string identifier contract. */
function isDataSchemaRef(value: unknown): boolean {
  return isRecord(value) && typeof value.id === 'string';
}

/*** Validate an omitted JSON-serializable scalar, array, or record value. */
function isOptionalSerializableValue(value: unknown): boolean {
  return value === undefined || isSerializableValue(value);
}

/*** Validate an omitted array of JSON-serializable values. */
function isOptionalSerializableValueArray(value: unknown): boolean {
  return value === undefined || (Array.isArray(value) && value.every(isSerializableValue));
}

/*** Validate one JSON-serializable value recursively. */
function isSerializableValue(value: unknown): boolean {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (Array.isArray(value) && value.every(isSerializableValue)) ||
    (isRecord(value) && Object.values(value).every(isSerializableValue))
  );
}
