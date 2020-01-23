import { EntityStorage, Component, ComponentStorage, Resource, ResourceStorage } from '.'

/** System are used to update Entities, Components and Resources. */
export abstract class System {
  public components: Component['constructor'][] = []
  public resources: Resource['constructor'][] = []

  constructor() {
    // check if in worker
    if (typeof window === 'undefined' && typeof self !== 'undefined') {
      self.addEventListener('message', (message) => {
        const { entities, components, resources } = message.data.data

        // @ts-ignore
        this.dispatch(entities, components, resources)
      })
    }
  }

  /**
   * System.dispatch is used to dispatch system.
   * When extending System, super.dispatch() must be called before any other logic.
   */
  public dispatch(
    entities: EntityStorage,
    components: ComponentStorage[],
    resources: Resource[],
  ) {
    // check if in worker
    if (typeof self !== 'undefined') {
      // @ts-ignore
      self.postMessage({ topic: 'response', data: { entities, components, resources } })
    }
  }
}

/** SystemStorage is used to store Systems. */
export type SystemStorage = Set<System>
