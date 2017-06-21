const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const NeuronState = require("../../src/enums").NeuronState
const Layer = require("../../src/layer")


describe("Layer Unit Tests", () => {

    describe("without mini-columns", () => {
        const config = {
            name: "layer 1",
            miniColumns: false,
            neuronCount: 100,
            dimensions: {
                x: 10, y: 10, z: 1
            }
        }
        let layer = new Layer(config)

        it("returns neurons in global index order", () => {
            // We'll turn on every 6th neuron globally.
            let activeIndices = []
            for (let i=0; i<100; i++) {
                if (i % 6 == 0) activeIndices.push(i)
            }
            layer.update(activeIndices)
            let count = 0
            for (var neuron of layer.getNeurons()) {
                let expectedState = count++ % 6 == 0 ? NeuronState.active : NeuronState.inactive
                expect(neuron.state).to.equal(expectedState)
            }
        })

        it("implicitly updates non-active cells to inactive", () => {
            // Now we'll turn on every 7th neuron globally, which should
            // override the previous state.
            let activeIndices = []
            for (let i=0; i<100; i++) {
                if (i % 7 == 0) activeIndices.push(i)
            }
            layer.update(activeIndices)
            let count = 0
            for (let neuron of layer.getNeurons()) {
                let expectedState = count++ % 7 == 0 ? NeuronState.active : NeuronState.inactive
                expect(neuron.state).to.equal(expectedState)
            }
        })
    })

})
