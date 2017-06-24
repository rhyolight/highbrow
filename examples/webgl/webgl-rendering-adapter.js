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
};

HtmHighbrowLayer.prototype.getY = function() {
    return this.dimensions.y
};

HtmHighbrowLayer.prototype.getZ = function() {
    return this.dimensions.z
};

/**
 * Gets the value of the cell given the coordinates.
 * @param x (int) x coordinate
 * @param y (int) y coordinate
 * @param z (int) z coordinate
 * @returns {*} whatever value was in the cell
 */
HtmHighbrowLayer.prototype.getCellValue = function(x, y, z) {
    let neuronState = this.layer.getNeuronByXyz(x, y, z).state
    let out = { state: neuronState }
    if (neuronState == "inactive") {
        out.color = new THREE.Color('#FFFEEE')
    } else {
        out.color = new THREE.Color('orange')
    }
    return out;
};
