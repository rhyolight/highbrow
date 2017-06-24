const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const NeuronState = require("../../src/enums").NeuronState
const Layer = require("../../src/layer")


describe("Layer Unit Tests", () => {

    const config = {
        name: "layer 1",
        miniColumns: false,
        neuronCount: 1000,
        dimensions: {
            x: 10, y: 10, z: 10
        }
    }
    let layer = new Layer(config)

    describe("regarding state updates", () => {

        it("returns neurons in global index order", () => {
            // We'll turn on every 6th neuron globally.
            let activeIndices = []
            for (let i = 0; i < config.neuronCount; i++) {
                if (i % 6 == 0) activeIndices.push(i)
            }
            layer.update(activeIndices)
            let count = 0
            for (var neuron of layer.getNeurons()) {
                let expectedState = count % 6 == 0 ? NeuronState.active : NeuronState.inactive
                expect(neuron.state).to.equal(expectedState)
                count++
            }
        })

        it("implicitly updates non-active cells to inactive", () => {
            // Now we'll turn on every 7th neuron globally, which should
            // override the previous state.
            let activeIndices = []
            for (let i = 0; i < config.neuronCount; i++) {
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

    describe("regarding neuron 3D placement", () => {

        /*
        Active cell indices returned from HTM systems generally are ordered with
        mini-columns grouped together. Since we want to render mini-columns from
        bottom to top, they need to be in the Y dimension, and that's why we
        translate the cell indices into the Y dimension first.
        */

        it("has y,x,z dimensional order", () => {
            for (let zcount = 0; zcount < config.dimensions.z; zcount++) {
                for (let xcount = 0; xcount < config.dimensions.x; xcount++) {
                    for (let ycount = 0; ycount < config.dimensions.y; ycount++) {
                        let globalIndex = zcount * config.dimensions.x * config.dimensions.y
                                        + xcount * config.dimensions.y
                                        + ycount
                        let neuron = layer.getNeuronByIndex(globalIndex)
                        expect(neuron.getOrigin()).to.deep.equal({
                            x: xcount, y: ycount, z: zcount
                        })
                    }
                }
            }
        })

    })


})
