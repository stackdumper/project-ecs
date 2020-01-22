import nanoid from 'nanoid'
import {
  EntityStorage,
  Component,
  ComponentStorage,
  Resource,
  ResourceStorage,
  System,
  SystemStorage,
} from '.'

export class Core {
  public entities = new EntityStorage()
  public components = new Map<Component['constructor'], ComponentStorage>()
  public resources = new ResourceStorage()
  public systems = new SystemStorage()

  /** Core.collected store computed Systems dependencies. */
  public collected = {
    components: new Map<System['constructor'], ComponentStorage[]>(),
    resources: new Map<System['constructor'], Resource[]>(),
  }

  /**
   * Core.addComponent registers a new component.
   * All components must be registered before use in Core.addEntity.
   */
  public addComponent(component: Component['constructor']) {
    // check if component is already registered
    if (this.components.has(component)) {
      throw new Error(`component is already registered: ${component}`)
    }

    // create component storage
    this.components.set(component, new ComponentStorage())
  }

  /** Core.addEntity adds a new entity to world. */
  public addEntity(components: Component[]) {
    const entity = nanoid()

    // add entity
    this.entities.add(entity)

    // add component
    for (const component of components) {
      this.components.get(component['constructor'])!.set(entity, component)
    }
  }

  public addResource(resource: Resource) {
    // check if resource is already present
    if (this.resources.has(resource.constructor)) {
      throw new Error(`resource is already present: ${resource}`)
    }

    // add resource
    this.resources.set(resource.constructor, resource)
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
      system.constructor,
      system.components.map((component) => this.components.get(component)!),
    )

    // collect resoruces
    this.collected.resources.set(
      system.constructor,
      system.resources.map((resource) => this.resources.get(resource)!),
    )

    // add system
    this.systems.add(system)
  }

  /**
   * Core.dispatch dispatches all systems previously added using Core.addSystem.
   * Uses components and resources previously collected by Core.addSystem.
   */
  public dispatch() {
    for (const system of this.systems) {
      // collect components
      const components = this.collected.components.get(system.constructor)!

      // collect resources
      const resources = this.collected.resources.get(system.constructor)!

      // dispatch system
      system.dispatch(this.entities, components, resources)
    }
  }
}
