import { Entity } from './entity'

/** Resource stores global data that can be used by Systems. */
export class Resource {
}

/** ResourceStorage is used to store Resources. */
export type ResourceStorage = Map<string, Resource>
