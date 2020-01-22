import { Entity, ComponentStorage, System } from '~/index'
import { ComponentPosition, ComponentVelocity } from './components'
import { ResourceClock } from './resources'

export class SystemVelocity extends System {
  public components = [ComponentPosition, ComponentVelocity]
  public resources = [ResourceClock]

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
  }
}
