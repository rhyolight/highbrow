// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const times = require("./utils").times
/** @ignore */
const NeuronState = require("./enums").NeuronState

/*
 * Active cell indices returned from HTM systems generally are ordered with
 * mini-columns grouped together. Since we want to render mini-columns as
 * depth, they need to be in the Z dimension, and that's why we translate
 * the cell indices into the z dimension first.
 *
 * @param {integer} idx - global HTM cell index for neuron within layer
 * @param {integer} rx - range of the x dimension
 * @param {integer} ry - range of the y dimension
 * @param {integer} rz - range of the z dimension
 * @return {Object} point with 3D coordinates
 * @property {number} x x coordinate
 * @property {number} y y coordinate
 * @property {number} z z coordinate
 */
 /** @ignore */
function getXyzFromIndex(idx, rx, ry, rz) {
    var result = {}
    var a = (rz * rx)
    result.y = Math.floor(idx / a)
    var b = idx - a * result.y
    result.x = Math.floor(b / rz)
    result.z = b % rz
    return result
}

/**
 * Represents a cortical layer within a {@link CorticalColumn}.
 */
class Layer extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._buildLayer()
    }

    /**
     * This function accepts HTM state data and updates the positions and states
     * of all {@link Renderable} HTM components.
     *
     * @param {list} activeCellIndexes - integers for indexes of active cells.
     * @param {list} activeColumnIndexes - integers for indexes of active
     *        mini-columns.
     */
    update(activeCellIndexes, activeColumnIndexes) {
        let index = 0
        for (let neuron of this.getNeurons()) {
            if (activeCellIndexes.includes(index)) {
                neuron.state = NeuronState.active
            } else {
                neuron.state = NeuronState.inactive
            }
            index++
        }
    }

    /**
     * @override
     */
    getChildren() {
        return this.getNeurons()
    }

    getNeurons() {
        return this._neurons
    }

    getNeuronByIndex(index) {
        return this.getNeurons().find(n => n.index == index)
    }

    /**
     * @override
     */
    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`
        if (verbose) {
            let children = this.getChildren()
            if (children.length) {
                for (let child of children) {
                    out += "\t" + child.toString().split("\n")
                                       .map(s => "\n\t" + s)
                                       .join("")
                }
            }
        } else {
            out += ` contains ${this._neurons.length} neurons`
        }
        return out
    }

    _buildLayer() {
        this._neurons = []
        times(this._config.neuronCount) (i =>
            this._neurons.push(new Neuron({
                index: i,
                state: NeuronState.inactive,
                origin: getXyzFromIndex(
                    i,
                    this._config.dimensions.x,
                    this._config.dimensions.y,
                    this._config.dimensions.z,
                )
            }, this))
        )
        if (this._config.miniColumns) {
            // TODO: implement minicolumns.
        }
    }

}

/**
 * Represents a mini-column within a {@link Layer}.
 */
class MiniColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
    }
}

/**
 * Represents a pyramidal neuron. The atomic unit of HTM computation.
 */
class Neuron extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._state = NeuronState.inactive
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
        let o = this.getOrigin()
        return `${this.getName()} at [${o.x}, ${o.y}, ${o.z}]`
    }

    set state (state)  { this._state = state }

    get state () { return this._state }

    // This index only changes if the config changes (unlikely).
    get index () { return this.getConfig()["index"] }

}

module.exports = Layer
