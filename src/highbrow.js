/*
 * TOP LEVEL
 */

class Highbrow {
    static createHtmNetwork(config) {
        return new HtmNetwork(config)
    }
}

/*
 * STATE ENUMS
 */

const NeuronState = {
    inactive: "inactive",
    active: "active",
    depolarized: "depolarized",
    predicted: "predicted",
}

const MiniColumnState = {
    inactive: "inactive",
    active: "active",
}

/*
 * RENDERABLES
 */

class Renderable {
    constructor(config, parent = undefined, scale = 1.0) {
        this._config = config
        this._parent = parent
        this._scale = scale
    }

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

class HtmNetwork extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._corticalColumns = this._config.corticalColumns.map((config) => {
            return new CorticalColumn(config, this)
        })
    }

    getOrigin() {
        throw new Error("Not implemented")
    }

    getChildren() {
        return this.getCorticalColumns()
    }

    getParent() {
        return undefined
    }

    getCorticalColumns() {
        return this._corticalColumns
    }

    getNeuronStates() {
        return NeuronState
    }

    getMiniColumnStates() {
        return MiniColumnState
    }
}

class HtmNetworkLink extends Renderable {
    getOrigin() {
        throw new Error("Not implemented")
    }

    getChildren() {
        return undefined
    }

    getParent() {
        return undefined
    }

}

class CorticalColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._layers = this._config.layers.map((config) => {
            return new Layer(config, this)
        })
    }

    getOrigin() {
        throw new Error("Not implemented")
    }

    getChildren() {
        return this.getLayers()
    }

    getParent() {
        return this._parent
    }

    getLayers() {
        return this._layers
    }

}

class Layer extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._buildLayer()
    }

    getOrigin() {
        throw new Error("Not implemented")
    }

    getChildren() {
        return this.getNeurons()
    }

    getParent() {
        return this._parent
    }

    getNeurons() {
        return this._neurons
    }

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

class MiniColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
    }

    getOrigin() {
        throw new Error("Not implemented")
    }
}

class Neuron extends Renderable {
    getOrigin() {
        throw new Error("Not implemented")
    }

    getChildren() {
        return []
    }

    getName() {
        return `${this._config.index} (${this._config.state})`
    }
}

/*
 * UTILITIES
 */

/* Just a counter loop, including iterator. */
const times = n => f => {
    let iter = i => {
        if (i === n) return
        f (i)
        iter (i + 1)
    }
    return iter (0)
}

module.exports = Highbrow
