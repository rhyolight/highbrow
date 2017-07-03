// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const Neuron = require("./neuron")
/** @ignore */
const NeuronState = require("./enums").NeuronState

/** @ignore */
const times = require("./utils").times

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
 * @return {Object} The position (not coordinate)
 * @property {integer} x x position
 * @property {integer} y y position
 * @property {integer} z z position
 */
 /** @ignore */
function getXyzPositionFromIndex(idx, xsize, ysize) {
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

    /**
     * Builds out the layer from scratch using the config object. Creates an
     * array of {@link Neuron}s that will be used for the lifespan of the Layer.
     */
    _buildLayer() {
        this._neurons = []
        let count = this._config.neuronCount
        let scale = this.getScale()
        for (let i = 0; i < count; i++) {
            let neuron = new Neuron({
                name: `Neuron ${i}`,
                state: NeuronState.inactive,
                index: i,
                position: getXyzPositionFromIndex(i,
                    this._config.dimensions.x,
                    this._config.dimensions.y
                ),
                scale: scale
            }, this)
            this._neurons.push(neuron)
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

module.exports = Layer
