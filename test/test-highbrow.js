const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect

const Highbrow = require("../src/highbrow")
const HtmNetwork = require("../src/htm-network")
const CorticalColumn = require("../src/cortical-column")
const Layer = require("../src/layer")
const Enums = require("../src/enums")
const NeuronState = Enums.NeuronState

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

describe("Highbrow network factory object model", () => {
    describe("when creating a one column one layer Network", () => {

        let network = Highbrow.createHtmNetwork(simple)
        it("returns an HtmNetwork object", () => {
            expect(network).to.be.instanceOf(HtmNetwork)
        })

        describe("HtmNetwork", () => {
            let columnTester = (columns) => {
                expect(columns).to.be.instanceOf(Array)
                expect(columns).to.be.length(1)
                let column = columns[0]
                expect(column).to.be.instanceOf(CorticalColumn)
                expect(column.getName()).to.equal("column 1")
            }
            it("exposes CorticalColumns through getCorticalColumns", () => {
                columnTester(network.getCorticalColumns())
            })
            it("exposes CorticalColumns through getChildren", () => {
                columnTester(network.getChildren())
            })


            describe("CorticalColumn", () => {
                let column = network.getChildren()[0]
                let layerTester = (layers) => {
                    expect(layers).to.be.instanceOf(Array)
                    expect(layers).to.be.length(1)
                    let layer = layers[0]
                    expect(layer).to.be.instanceOf(Layer)
                    expect(layer.getName()).to.equal("layer 1")
                }
                it("exposes Layers through getLayers", () => {
                    layerTester(column.getLayers())
                })
                it("exposes Layers through getChildren", () => {
                    layerTester(column.getChildren())
                })
            })
        })
    })
})

describe("simple network data update", () => {
    let network = Highbrow.createHtmNetwork(simple)
    let originalColumns = network._corticalColumns

    describe("HtmNetwork", () => {
        it("calls update on CorticalColumn with column data", () => {
            let timesCalled = 0
            let mockColumn = {
                update: (data) => {
                    timesCalled++
                    expect(data).to.equal(mockData["column 1"])
                },
                getName: () => "column 1"
            }
            network._corticalColumns = [mockColumn]
            const mockData = {"column 1":{"layer1":"mockLayerData"}}
            network.update(mockData)
            expect(timesCalled).to.equal(1)
            network._corticalColumns = originalColumns
        })
    })

    describe("CorticalColumn", () => {
        let column = network.getChildren()[0]
        let originalLayers = column.getLayers()
        it("calls update on all Layers with active cells", () => {
            let timesCalled = 0
            let mockLayer = {
                update: (activeCells, activeColumns) => {
                    timesCalled++
                    expect(activeCells).to.equal("mockActiveCells")
                    expect(activeColumns).to.equal(undefined)
                },
                getName: () => "layer 1"
            }
            column._layers = [mockLayer]
            const mockData = {"layer 1":{"activeCells": "mockActiveCells"}}
            column.update(mockData)
            expect(timesCalled).to.equal(1)
            column._layers = originalLayers
        })
    })

    describe("Layer", () => {
        let layer = network.getChildren()[0].getChildren()[0]

        it("updates active cell Neuron states", () => {
            const activeCells = [0,10,20,30]
            layer.update(activeCells)
            for (const [index, neuron] of layer.getNeurons().entries()) {
                let shouldBeActive = activeCells.includes(index)
                let expectedState = shouldBeActive ? NeuronState.active : NeuronState.inactive
                expect(neuron.state).to.equal(expectedState)
            }
        })
    })
})
