import { Component } from '../src'

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
