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
 * mini-columns grouped together. Since we want to render mini-columns from top
 * to bottom, they need to be in the Y dimension, and that's why we translate
 * the cell indices into the Y dimension first.
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
function getXyzFromIndex(idx, xsize, ysize) {
    var zcapacity = xsize * ysize;
    var x = 0, y = 0, z = 0;
    if (idx >= zcapacity) {
        z = Math.floor(idx / zcapacity);
    }
    var idx2d = idx - (zcapacity * z);
    if (idx2d > (ysize-1)) {
        x = Math.floor(idx2d / ysize);
    }
    var y = idx2d - (ysize * x);
    return {x: x, y: y, z: z};
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
     * Will return a list of {@link Neuron}s in global cell order.
     * @override
     * @returns {Neuron[]} all the neurons in global cell order
     */
    getChildren() {
        return this.getNeurons()
    }

    /**
     * Will return a list of {@link Neuron}s in global cell order.
     * @override
     * @returns {Neuron[]} all the neurons in global cell order
     */
    getNeurons() {
        return this._neurons
    }

    /**
     * Get {@link Neuron} by global cell index.
     * @param {int} index - index of neuron to get
     * @returns {Neuron} the neuron at specified index
     * @throws {KeyError} if invalid index
     */
    getNeuronByIndex(index) {
        return this.getNeurons()[index]
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

    /*
     * Builds out the layer from scratch using the config object.
     */
    _buildLayer() {
        this._neurons = []
        let count = this._config.neuronCount
        let scale = this.getScale()
        for (let i = 0; i < count; i++) {
            this._neurons.push(new Neuron({
                name: `Neuron ${i}`,
                state: NeuronState.inactive,
                origin: getXyzFromIndex(i,
                    this._config.dimensions.x,
                    this._config.dimensions.y
                ),
                scale: scale
            }, this))
        }
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

    activate() {
        this._state = NeuronState.active
    }

    deactivate() {
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
        let n = this.getName()
        let o = this.getOrigin()
        let s = this.getScale()
        return `${n} at [${o.x}, ${o.y}, ${o.z}] (scaled by ${s})`
    }

    set state (state)  { this._state = state }

    get state () { return this._state }

    // This index only changes if the config changes (unlikely).
    get index () { return this.getConfig()["index"] }

}

module.exports = Layer
