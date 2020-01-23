import { Core, Thread } from '~/index'
import { ComponentPosition, ComponentVelocity } from './components'
import { ResourceClock } from './resources'
import { SystemVelocity } from './systems'

describe('Core', () => {
  const core = new Core()

  it('addComponent', () => {
    // add components
    core.addComponent(ComponentPosition)
    core.addComponent(ComponentVelocity)

    // check if rejects to add duplicate components
    expect(() => core.addComponent(ComponentPosition)).toThrow()
    expect(() => core.addComponent(ComponentVelocity)).toThrow()

    // check if components were added
    expect(core.components.has(ComponentPosition.name)).toBe(true)
    expect(core.components.get(ComponentPosition.name)!.size).toBe(0)
    expect(core.components.has(ComponentVelocity.name)).toBe(true)
    expect(core.components.get(ComponentVelocity.name)!.size).toBe(0)
  })

  it('addResource', () => {
    const resource = new ResourceClock()

    // add resource
    core.addResource(resource)

    // check if rejects to add duplicate resource
    expect(() => core.addResource(resource)).toThrow()

    // check if resource was added
    expect(core.resources.has(resource.constructor.name)).toBe(true)
  })

  it('addSystem', () => {
    const system = new SystemVelocity()

    // add system
    core.addSystem(system)

    // check if rejects to add duplicate system
    expect(() => core.addSystem(system)).toThrow()

    // check if system was added
    expect(core.systems.has(system)).toBe(true)
  })

  it('addEntity', () => {
    // add entity
    core.addEntity([new ComponentPosition(0.0, 0.0), new ComponentVelocity(0.0, 1.0)])

    // check if components were added to corresponding storages
    expect(core.components.get(ComponentPosition.name)!.size).toBe(1)
    expect(core.components.get(ComponentVelocity.name)!.size).toBe(1)
  })

  it('dispatch', () => {
    core.dispatch()

    // @ts-ignore
    expect(Array.from(core.components.get(ComponentPosition.name)!.values())[0].y).toEqual(1)
  })
})
