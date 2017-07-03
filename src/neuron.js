// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const NeuronState = require("./enums").NeuronState

/**
 * Represents a pyramidal neuron. The atomic unit of HTM computation.
 */
class Neuron extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._state = NeuronState.inactive
        this._position = config.position
    }

    activate() {
        this.setState(NeuronState.active)
    }

    deactivate() {
        this.setState(NeuronState.inactive)
    }

    /**
     * Neurons are not created with an origin initially like other
     * {@link Renderable} objects, because they are laid out in a grid
     * within the Layer space. But we know the position, so we can calculate the
     * origin using the scale.
     */
    getOrigin() {
        let pos = this._position
        let scale = this.getScale()
        return {
            x: pos.x * scale,
            y: pos.y * scale,
            z: pos.z * scale,
        }
    }

    /**
     * @override NOOP
     * @returns [] empty list
     */
    getChildren() {
        return []
    }

    /**
     * @override
     */
    getName() {
        return `${this.index} (${this.state})`
    }

    /**
     * @override
     */
    toString() {
        let n = this.getName()
        let p = this.position
        let o = this.getOrigin()
        let s = this.getScale()
        return `${n} at position [${p.x}, ${p.y}, ${p.z}], coordinate [${o.x}, ${o.y}, ${o.z}] (scaled by ${s})`
    }

    setState (state)  {
        this._state = state
    }

    getState () {
        return this._state
    }

    getPosition() {
        return this._position
    }

    // This index only changes if the config changes (unlikely).
    getIndex () {
        return this.getConfig()["index"]
    }

}

module.exports = Neuron
