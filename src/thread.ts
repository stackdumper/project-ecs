import { EntityStorage, Component, ComponentStorage, Resource } from '.'

export class Thread {
  public components: Component['constructor'][] = []
  public resources: Resource['constructor'][] = []

  constructor(private worker: Worker) {}

  public dispatch = (
    entities: EntityStorage,
    components: ComponentStorage[],
    resources: Resource[],
  ): Promise<{
    entities: EntityStorage
    components: ComponentStorage[]
    resources: Resource[]
  }> =>
    new Promise((resolve, reject) => {
      this.worker.onmessage = (message) => {
        const { entities, components, resources } = message.data.data

        resolve({ entities, components, resources })
      }

      this.worker.postMessage({
        topic: 'dispatch',
        data: { entities, components, resources },
      })
    })
}

export class ThreadStorage extends Set<Thread> {}
