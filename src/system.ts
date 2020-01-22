import { EntityStorage, Component, ComponentStorage, Resource } from '.'

/** System are used to update Entities, Components and Resources. */
export abstract class System {
  public components: Component['constructor'][] = []
  public resources: Resource['constructor'][] = []

  public dispatch(
    entities: EntityStorage,
    components: ComponentStorage[],
    resources: Resource[],
  ) {}
}

/** SystemStorage is used to store Systems. */
export class SystemStorage extends Set<System> {}
