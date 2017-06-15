/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const Layer = require("./layer")

/**
 * Represents a cortical column.
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

    /**
     * @return {HtmNetworkLink[]} All the links within this column. Does not
     *         return inter-column links. You must get those from the parent.
     */
    getHtmNetworkLinks() {
        let columnLinks = this.getCorticalColumns().map((c) => {
            c.getHtmNetworkLinks()
        })
        return [].concat(...columnLinks)
    }
}

module.exports = CorticalColumn
