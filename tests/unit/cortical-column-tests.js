const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const HtmNetwork = require("../../src/htm-network")

describe("CorticalColumn Unit Tests", () => {

    describe("when constructing a simple column", () => {
        let config = Object.assign({}, testConfigs.simple);
        config.origin = {x: 1, y: 345, z: -94};
        const network = new HtmNetwork(config)
        const column = network.getCorticalColumns()[0]
        it("creates the first layer at the same origin as itself", () => {
            let layer = column.getLayers()[0]
            expect(layer.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })

    describe("when constructing a 2-layer column", () => {
        const network = new HtmNetwork(testConfigs.oneColTwoLayers)
        const column = network.getCorticalColumns()[0]
        it("creates the first layer at the same origin as itself", () => {
            let layer = column.getLayers()[0]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
        })
        it("creates the second layer above first layer with one empty position between", () => {
            let layer = column.getLayers()[1]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 11, z: 0})
        })
        it("allows user defined layer spacing", () => {
            let config = Object.assign({}, testConfigs.oneColTwoLayers);
            config.corticalColumns[0].spacing = 5
            const network = new HtmNetwork(config)
            const column = network.getCorticalColumns()[0]
            let layer = column.getLayers()[1]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 15, z: 0})
        })
    })

    describe("when constructing a 3-layer column", () => {
        const network = new HtmNetwork(testConfigs.oneColThreeLayers)
        const column = network.getCorticalColumns()[0]
        it("creates the third layer above second layer with one empty position between", () => {
            let layer = column.getLayers()[2]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 12, z: 0})
        })
        it("allows user defined layer spacing", () => {
            let config = Object.assign({}, testConfigs.oneColThreeLayers);
            config.corticalColumns[0].spacing = 5
            const network = new HtmNetwork(config)
            const column = network.getCorticalColumns()[0]
            let layer = column.getLayers()[2]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 20, z: 0})
        })
    })

})
