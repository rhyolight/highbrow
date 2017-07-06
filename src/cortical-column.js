// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

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
        this._buildColumn()
    }

    _buildColumn() {
        let columnOrigin = this.getOrigin()
        let scale = this.getScale()
        let accumulationForLayerY = 0

        console.log("processing layers for %s", this.getName())
        // Reverse the layer configuration so that they render from bottom to
        // top.
        let reversedLayers = this._config.layers.slice().reverse()
        this._layers = reversedLayers.map((layerConfigOriginal, layerIndex) => {
            let layerConfig = Object.assign({}, layerConfigOriginal)
            layerConfig.scale = scale
            layerConfig.origin = this.getOrigin()

            // Layers need spacing in between them, which will affect their
            // origin points in the Y direction. If there are multiple layers,
            // their Y origins get updated here using the scale, column spacing,
            // and the sizes of lower layers. Each layer is rendered below the
            // last to keep the config alignment the same as the visual
            // alignment.
            layerConfig.origin.y = layerConfig.origin.y
                                    + accumulationForLayerY * scale
                                    + this.getSpacing() * layerIndex

            let layer = new Layer(layerConfig, this)
            accumulationForLayerY += layer.getDimensions().y
            return layer
        }).reverse()
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
