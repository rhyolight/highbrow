/**
 * @constant All the states a neuron might be in.
 */
const NeuronState = {
    inactive: "inactive",
    active: "active",
    depolarized: "depolarized",
    predicted: "predicted",
}

/**
 * @constant All the states a mini-column might be in.
 */
const MiniColumnState = {
    inactive: "inactive",
    active: "active",
}

/*
 * TOP LEVEL (this gets exported)
 */


/**
 * Start here.
 */
class Highbrow {
    static createHtmNetwork(config) {
        return new HtmNetwork(config)
    }

    static getNeuronStates() {
        return NeuronState
    }

    static getMiniColumnStates() {
        return MiniColumnState
    }
}

/*
 * RENDERABLES
 */

/**
 * @interface
 */
class Renderable {
    constructor(config, parent = undefined, scale = 1.0) {
        this._config = config
        this._parent = parent
        this._scale = scale
    }

    /**
     * @abstract
     */
    getOrigin() {
        throw new Error("Renderable Highbrow objects must provide getOrigin()")
    }

    setScale(scale) {
        this._scale = scale
    }

    getScale() {
        return this._scale
    }

    getName() {
        return this._config.name
    }

    getParent() {
        return this._parent
    }

    /**
     * @abstract
     */
    getChildren() {
        throw new Error(
            "Renderable Highbrow objects must provide getChildren()"
        )
    }

    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`
        let children = this.getChildren()
        if (children.length) {
            for (let child of children) {
                out += "\t" + child.toString(verbose).split("\n")
                                   .map(s => "\n\t" + s)
                                   .join("")
            }
        }
        return out
    }

}

/**
 * @implements {Renderable}
 */
class HtmNetwork extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._corticalColumns = this._config.corticalColumns.map((config) => {
            return new CorticalColumn(config, this)
        })
    }

    /**
     * @override
     */
    getOrigin() {
        throw new Error("Not implemented")
    }

    /**
     * @override
     */
    getChildren() {
        return this.getCorticalColumns()
    }

    getCorticalColumns() {
        return this._corticalColumns
    }

}

/**
 * @implements {Renderable}
 */
class HtmNetworkLink extends Renderable {
    getOrigin() {
        throw new Error("Not implemented")
    }

    /**
     * @override
     */
    getChildren() {
        return undefined
    }

}

/**
 * @implements {Renderable}
 */
class CorticalColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._layers = this._config.layers.map((config) => {
            return new Layer(config, this)
        })
    }

    /**
     * @override
     */
    getOrigin() {
        throw new Error("Not implemented")
    }

    /**
     * @override
     */
    getChildren() {
        return this.getLayers()
    }

    getLayers() {
        return this._layers
    }

}

/**
 * @implements {Renderable}
 */
class Layer extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._buildLayer()
    }

    /**
     * @override
     */
    getOrigin() {
        throw new Error("Not implemented")
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
            out += `contains ${this._neurons.length} neurons`
        }
        return out
    }

    _buildLayer() {
        this._neurons = []
        times(this._config.neuronCount) (i =>
            this._neurons.push(new Neuron({
                index: i,
                state: NeuronState.inactive
            }, this))
        )
        if (this._config.miniColumns) {
            // TODO: implement minicolumns.
        }
    }

}

/**
 * @implements {Renderable}
 */
class MiniColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
    }

    /**
     * @override
     */
    getOrigin() {
        throw new Error("Not implemented")
    }
}

/**
 * @implements {Renderable}
 */
class Neuron extends Renderable {
    getOrigin() {
        throw new Error("Not implemented")
    }

    /**
     * @override
     */
    getChildren() {
        return []
    }

    /**
     * @override
     */
    getName() {
        return `${this._config.index} (${this._config.state})`
    }
}

/*
 * UTILITIES
 */

/**
 * @ignore Just a counter loop, including iterator.
 */
const times = n => f => {
    let iter = i => {
        if (i === n) return
        f (i)
        iter (i + 1)
    }
    return iter (0)
}

module.exports = Highbrow
