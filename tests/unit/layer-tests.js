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

    describe("regarding state updates", () => {

        let layer = new Layer(config)

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
                expect(neuron.getState()).to.equal(expectedState)
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
                expect(neuron.getState()).to.equal(expectedState)
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

        let layer = new Layer(config)

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

    describe("at default scale of 1.0", () => {
        let layer = new Layer(config)

        it("neuron origins are not scaled", () => {
            for (let zcount = 0; zcount < config.dimensions.z; zcount++) {
                for (let xcount = 0; xcount < config.dimensions.x; xcount++) {
                    for (let ycount = 0; ycount < config.dimensions.y; ycount++) {
                        let globalIndex = zcount * config.dimensions.x * config.dimensions.y
                                        + xcount * config.dimensions.y
                                        + ycount
                        let neuron = layer.getNeuronByIndex(globalIndex)
                        let origin = neuron.getOrigin()
                        expect(origin).to.deep.equal({
                            x: xcount, y: ycount, z: zcount
                        })
                    }
                }
            }
        })
    })

    describe("at scale of 2.0", () => {
        let scaledConfig = Object.assign({}, config)
        scaledConfig.scale = 2.0
        let layer = new Layer(scaledConfig, "test")
        it("neuron origin coordinates are doubled", () => {
            for (let zcount = 0; zcount < config.dimensions.z; zcount++) {
                for (let xcount = 0; xcount < config.dimensions.x; xcount++) {
                    for (let ycount = 0; ycount < config.dimensions.y; ycount++) {
                        let globalIndex = zcount * config.dimensions.x * config.dimensions.y
                                        + xcount * config.dimensions.y
                                        + ycount
                        let neuron = layer.getNeuronByIndex(globalIndex)
                        let origin = neuron.getOrigin()
                        expect(origin).to.deep.equal({
                            x: xcount * 2,
                            y: ycount * 2,
                            z: zcount * 2
                        })
                    }
                }
            }
        })
    })

    describe("at scale of 0.5", () => {
        let scaledConfig = Object.assign({}, config)
        scaledConfig.scale = 0.5
        let layer = new Layer(scaledConfig, "test")
        it("neuron origin coordinates are halved", () => {
            for (let zcount = 0; zcount < config.dimensions.z; zcount++) {
                for (let xcount = 0; xcount < config.dimensions.x; xcount++) {
                    for (let ycount = 0; ycount < config.dimensions.y; ycount++) {
                        let globalIndex = zcount * config.dimensions.x * config.dimensions.y
                                        + xcount * config.dimensions.y
                                        + ycount
                        let neuron = layer.getNeuronByIndex(globalIndex)
                        let origin = neuron.getOrigin()
                        expect(origin).to.deep.equal({
                            x: xcount * 0.5,
                            y: ycount * 0.5,
                            z: zcount * 0.5
                        })
                    }
                }
            }
        })
    })


})
