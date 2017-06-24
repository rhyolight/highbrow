/**
 * This interface is used to update cell data within the SpToInputVisualization.
 * Once created, use it to update cell values.
 * @param {HtmNetwork} network - from Highbrow.
 */
function HtmHighbrowCells(network) {
    this.network = network
    this.dimensions = network.getCorticalColumns()[0].getLayers()[0].getDimensions()
    this.cells = []

    // Create initially empty matrices.
    var ylist;
    var zlist;
    for (var cx = 0; cx < this.dimensions.x; cx++) {
        ylist = [];
        for (var cy = 0; cy < this.dimensions.y; cy++) {
            zlist = [];
            for (var cz = 0; cz < this.dimensions.z; cz++) {
                zlist.push({color: 0})
            }
            ylist.push(zlist)
        }
        this.cells.push(ylist)
    }
}

HtmHighbrowCells.prototype.getX = function() {
    return this.dimensions.x
};

HtmHighbrowCells.prototype.getY = function() {
    return this.dimensions.y
};

HtmHighbrowCells.prototype.getZ = function() {
    return this.dimensions.z
};

/**
 * Gets the value of the cell given the coordinates.
 * @param x (int) x coordinate
 * @param y (int) y coordinate
 * @param z (int) z coordinate
 * @returns {*} whatever value was in the cell
 */
HtmHighbrowCells.prototype.getCellValue = function(x, y, z) {
    // TODO: raise error if cell coordinates are invalid.
    return this.cells[x][y][z];
};

/**
 * Allows user to update a cell's value.
 * @param x (int) x coordinate
 * @param y (int) y coordinate
 * @param z (int) z coordinate
 * @param value {*} should contain a color, perhaps more
 */
HtmHighbrowCells.prototype.update = function(data) {
    this.network.update(data)
};

/**
 * Updates all cell values to given value.
 * @param value {*} Whatever value you want the cells to have.
 */
HtmHighbrowCells.prototype.updateAll = function(value) {
    for (var cx = 0; cx < this.dimensions.x; cx++) {
        for (var cy = 0; cy < this.dimensions.y; cy++) {
            for (var cz = 0; cz < this.dimensions.z; cz++) {
                this.update(cx, cy, cz, value);
            }
        }
    }
};
