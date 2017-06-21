// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

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
     * This function accepts HTM state data and updates the
     * positions and states of all {@link Renderable} HTM components.
     *
     * @param {Object} data - I don't know what this is going to look like yet.
     */
    update(data) {
        for (let layerConfig of this.getConfig()['layers']) {
            // console.log(layerConfig)
            let layer = this.getChildByName(layerConfig.name)
            // console.log(layer.toString())
            let layerData = data[layerConfig.name]
            let activeCellIndexes = undefined
            let activeColumnIndexes = undefined
            // Handles if only cell data is sent
            if (Array.isArray(layerData)) {
                activeCellIndexes = layerData
            } else {
                activeCellIndexes = layerData.activeCells
                activeColumnIndexes = layerData.activeColumns
            }
            layer.update(activeCellIndexes, activeColumnIndexes)
        }
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
