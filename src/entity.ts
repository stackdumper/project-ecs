/** Entity is a string that links different Components together. */
export type Entity = string

/** EntityStorage is used to store Entities. */
export class EntityStorage extends Set<Entity> {}
