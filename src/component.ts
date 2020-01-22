import intersection from 'lodash.intersection'
import { Entity } from '.'

/** Component stores data for specific entity. */
export class Component {}

/** ComponentStorage is used to store components with Entity as key */
export class ComponentStorage<C extends Component = Component> extends Map<Entity, C> {
  /** ComponentStorage.join is used to join multiple component storages by entity */
  static join: ComponentStorage.Join = (...storages: ComponentStorage[]) => {
    const joint = new Map()

    for (const key of intersection(...storages.map((s) => Array.from(s.keys())))) {
      const components = storages.map((storage) => storage.get(key))

      joint.set(key, components)
    }

    return joint
  }
}

namespace ComponentStorage {
  interface S<X> extends ComponentStorage<X> {}

  export interface Join {
    <A, B>(a: S<A>, b: S<B>): S<[A, B]>
    <A, B, C>(a: S<A>, b: S<B>, c: S<C>): S<[A, B, C]>
    <A, B, C, D>(a: S<A>, b: S<B>, c: S<C>, d: S<D>): S<[A, B, C, D]>
    <A, B, C, D, E>(a: S<A>, b: S<B>, c: S<C>, d: S<D>, e: S<E>): S<[A, B, C, D, E]>
  }
}
