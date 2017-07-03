/**
 * This interface is used to update cell data within the SpToInputVisualization.
 * Once created, use it to update cell values.
 * @param {Layer} layer - from Highbrow.
 */
function HtmHighbrowLayer(layer) {
    this.layer = layer
    this.dimensions = layer.getDimensions()
}

HtmHighbrowLayer.prototype.getX = function() {
    return this.dimensions.x
}

HtmHighbrowLayer.prototype.getY = function() {
    return this.dimensions.y
}

HtmHighbrowLayer.prototype.getZ = function() {
    return this.dimensions.z
}

HtmHighbrowLayer.prototype.size = function() {
    return this.layer.getNeurons().length
}

HtmHighbrowLayer.prototype.getCellPosition = function(index) {
    return this.layer.getNeuronByIndex(index).getOrigin()
}

/**
 * Gets the value of the cell given the global index.
 * @param index (int) global cell position.
 * @returns {*} whatever value was in the cell
 */
HtmHighbrowLayer.prototype.getCellValue = function(index) {
    let neuronState = this.layer.getNeuronByIndex(index).state
    let out = { state: neuronState }
    if (neuronState == "inactive") {
        out.color = new THREE.Color('#FFFEEE')
    } else {
        out.color = new THREE.Color('orange')
    }
    return out;
};
