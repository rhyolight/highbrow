let Highbrow = require("./src/highbrow")

let networkConfiguration = {
    name: "simple network example",
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1a",
                miniColumns: false,
                neuronCount: 8,
                dimensions: {
                    x: 2, y: 2, z: 2
                }
            },
            {
                name: "layer 1b",
                miniColumns: false,
                neuronCount: 8,
                dimensions: {
                    x: 2, y: 2, z: 2
                }
            }
        ]
    }, {
        name: "column 2",
        layers: [
            {
                name: "layer 2a",
                miniColumns: false,
                neuronCount: 12,
                dimensions: {
                    x: 3, y: 4, z: 1
                }
            },
            {
                name: "layer 2b",
                miniColumns: false,
                neuronCount: 12,
                dimensions: {
                    x: 3, y: 4, z: 1
                }
            }
        ]
    }]
}

network = Highbrow.createHtmNetwork(networkConfiguration)

console.log(network.toString(verbose=true))
