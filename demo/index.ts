import {
  Core,
  Component,
  Resource,
  System,
  EntityStorage,
  ComponentStorage,
  Thread,
} from '../src'

export class ComponentPosition extends Component {
  constructor(public x: number, public y: number) {
    super()
  }
}

export class ComponentVelocity extends Component {
  constructor(public x: number, public y: number) {
    super()
  }
}

export class ResourceTest extends Resource {}

export class ResourceClock extends Resource {
  constructor(public dt: number = 0.0) {
    super()
  }
}

export class SystemClock extends System {
  public resources = [ResourceClock]

  public dispatch(
    entities: EntityStorage,
    components: ComponentStorage[],
    [clock]: [ResourceClock],
  ) {
    super.dispatch(entities, components, [clock])

    clock.dt = Math.random() + 0.5
  }
}

export class VelocityThread extends Thread {
  public components = [ComponentPosition, ComponentVelocity]
  public resources = [ResourceClock]

  constructor() {
    super(new Worker('./system.ts'))
  }
}

export class VelocityThread2 extends Thread {
  public components = [ComponentPosition, ComponentVelocity]
  public resources = [ResourceClock]

  constructor() {
    super(new Worker('./system.ts'))
  }
}

window.addEventListener('load', async () => {
  const core = new Core()

  // register components
  core.addComponent(ComponentPosition)
  core.addComponent(ComponentVelocity)

  // add resources
  core.addResource(new ResourceTest())
  core.addResource(new ResourceClock())

  // add systems
  core.addSystem(new SystemClock())

  // add entities
  for (const _ of Array(1000)) {
    core.addEntity([new ComponentPosition(0.0, 0.0), new ComponentVelocity(0.1, 0.1)])
  }

  // console.log(new Worker('./system.ts').postMessage(new ResourceClock()));

  // // add threads
  // core.addThread(new VelocityThread())
  // core.addThread(new VelocityThread2())

  let last = performance.now()

  // update core
  for (const _ of Array(1000)) {
    await core.dispatch()
    const now = performance.now()
    console.log(now - last)
    last = now
  }
})
