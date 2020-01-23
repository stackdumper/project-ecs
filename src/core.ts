import nanoid from 'nanoid'
import {
  Entity,
  EntityStorage,
  Component,
  ComponentStorage,
  Resource,
  ResourceStorage,
  System,
  SystemStorage,
  Thread,
  ThreadStorage,
} from '.'

export class Core {
  public entities: EntityStorage = new Set<Entity>()
  public components = new Map<string, ComponentStorage>()
  public resources = new Map<string, Resource>()
  public systems = new Set<System>()
  public threads = new ThreadStorage()

  /** Core.collected store computed Systems dependencies. */
  public collected = {
    components: new Map<string, ComponentStorage[]>(),
    resources: new Map<string, Resource[]>(),
  }

  /**
   * Core.addComponent registers a new component.
   * All components must be registered before use in Core.addEntity.
   */
  public addComponent(component: Component['constructor']) {
    // check if component is already registered
    if (this.components.has(component.name)) {
      throw new Error(`component is already registered: ${component}`)
    }

    // create component storage
    this.components.set(component.name, new ComponentStorage())
  }

  /** Core.addEntity adds a new entity to world. */
  public addEntity(components: Component[]) {
    const entity = nanoid()

    // add entity
    this.entities.add(entity)

    // add component
    for (const component of components) {
      this.components.get(component.constructor.name)!.set(entity, component)
    }
  }

  public addResource(resource: Resource) {
    // check if resource is already present
    if (this.resources.has(resource.constructor.name)) {
      throw new Error(`resource is already present: ${resource}`)
    }

    // add resource
    this.resources.set(resource.constructor.name, resource)
  }

  /**
   * Core.addSystem adds a new system to be later dispatched in Core.dispatch.
   * Precollects resources to avoid additional collections on each dispatch.
   */
  public addSystem(system: System) {
    // check if component is already present
    if (this.systems.has(system)) {
      throw new Error(`system is already present: ${system}`)
    }

    // collect components
    this.collected.components.set(
      system.constructor.name,
      system.components.map((component) => this.components.get(component.name)!),
    )

    // collect resoruces
    this.collected.resources.set(
      system.constructor.name,
      system.resources.map((resource) => this.resources.get(resource.name)!),
    )

    // add system
    this.systems.add(system)
  }

  public addThread(thread: Thread) {
    // check if component is already present
    if (this.threads.has(thread)) {
      throw new Error(`thread is already present: ${thread}`)
    }

    // collect components
    this.collected.components.set(
      thread.constructor.name,
      thread.components.map((component) => this.components.get(component.name)!),
    )

    // collect resoruces
    this.collected.resources.set(
      thread.constructor.name,
      thread.resources.map((resource) => this.resources.get(resource.name)!),
    )

    this.threads.add(thread)
  }

  /**
   * Core.dispatch dispatches all systems previously added using Core.addSystem.
   * Uses components and resources previously collected by Core.addSystem.
   */
  public async dispatch() {
    // dispatch systems
    for (const system of this.systems) {
      // collect components
      const components = this.collected.components.get(system.constructor.name)!

      // collect resources
      const resources = this.collected.resources.get(system.constructor.name)!

      // dispatch system
      system.dispatch(this.entities, components, resources)
    }

    // dispatch threads
    for (const thread of this.threads) {
      // collect components
      const components = this.collected.components.get(thread.constructor.name)!

      // collect resources
      const resources = this.collected.resources.get(thread.constructor.name)!

      const result = await thread.dispatch(this.entities, components, resources)

      result.components.forEach((component, i: number) => {
        for (const [key, value] of component) {
          components[i].set(key, value)
        }
      })

      result.resources.forEach((resource, i: number) => {
        Object.assign(resources[i], resource)
      })
    }
  }
}
