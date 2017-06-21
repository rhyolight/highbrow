// Simple network configuration. One column, one layer, no mini-columns.
const simple = {
    name: "simple network",
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }
        ]
    }]
}

// Complex network with multiple columns and layers, includes mini-columns.
const complex = {
    name: "simple network",
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1-1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }, {
                name: "layer 1-2",
                miniColumns: true,
                neuronCount: 4096,
                dimensions: {
                    x: 30, y: 35, z: 4
                }
            }
        ]
    }, {
        name: "column 2",
        layers: [
            {
                name: "layer 2-1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }, {
                name: "layer 2-2",
                miniColumns: true,
                neuronCount: 4096,
                dimensions: {
                    x: 30, y: 35, z: 4
                }
            }
        ]
    }]
}

module.exports = {simple, complex}
