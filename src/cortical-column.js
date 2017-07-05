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
        this._layers = this._config.layers.map((layerConfig, index) => {
            // When creating children, we must apply the scale to the origin
            // points to render them in the right perspective.
            layerConfig.origin = Object.assign(
                {}, this.getOrigin()
            )
            // We also need to set the same scale on all layers as we have as
            // the parent.
            layerConfig.scale = this.getScale()

            // Layers need spacing in between them, which will affect their
            // origin points in the Y direction. If there are multiple layers,
            // their Y origins get updated here using the column spacing and the
            // sizes of lower layers.

            // FIXME: I think there is abug here, but my tests don't uncover it.
            //        It's because only the layer immediately under the current
            //        layer has its Y dimension counted, lower layers may have
            //        other Y dimensions.
            if (index > 0) {
                layerConfig.origin.y =
                    this._config.layers[index - 1].dimensions.y * index
                    + this.getSpacing() * index
            }
            // Attach the same scale to the layer if it doesn't have one set.
            // if (layerConfig.scale == undefined) {
            //     layerConfig.scale = config.scale
            // }
            return new Layer(layerConfig, this)
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
