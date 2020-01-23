import { System, ComponentStorage, Entity } from '../src'
import {
  ComponentPosition,
  ComponentVelocity,
  ResourceTest,
  ResourceClock,
} from './index'

export class VelocityThreadWorker extends System {
  public dispatch(
    _: Set<Entity>,
    [pos, vel]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentVelocity>,
    ],
    [clock]: [ResourceClock],
  ) {
    for (const [position, velocity] of ComponentStorage.join(pos, vel).values()) {
      position.x += velocity.x * clock.dt
      position.y += velocity.y * clock.dt
    }

    super.dispatch(_, [pos, vel], [clock])
  }
}

new VelocityThreadWorker()
