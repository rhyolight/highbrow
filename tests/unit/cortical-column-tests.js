const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const CorticalColumn = require("../../src/cortical-column")

describe("CorticalColumn Unit Tests", () => {

    describe("upon construction", () => {
        let config = Object.assign({}, testConfigs.simple).corticalColumns[0]
        config.origin = {x: 1, y: 345, z: -94}
        config.scale = 44
        const column = new CorticalColumn(config)
        const layer = column.getLayers()[0]
        it("creates the first layer at the same origin as itself", () => {
            expect(layer.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
        it("creates the first layer with the same scale as itself", () => {
            expect(layer.getScale()).to.deep.equal(44)
        })
    })

    describe("when scale is applied upon construction", () => {
        let config = Object.assign({}, testConfigs.simple).corticalColumns[0]
        config.origin = {x: 1, y: 345, z: -94}
        config.scale = 2.2
        const column = new CorticalColumn(config)
        const layer = column.getLayers()[0]
        it("does not scale its own origin", () => {
            expect(column.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
        it("does not scale the layer's origin", () => {
            expect(layer.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })

    describe("when constructing a 2-layer column", () => {
        let config = Object.assign({}, testConfigs.oneColTwoLayers.corticalColumns[0])
        config.origin = {x: 0, y: 0, z: 0}
        const column = new CorticalColumn(config)
        it("creates the first layer at the same origin as itself", () => {
            let layer = column.getLayers()[0]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
        })
        it("creates the second layer above first layer with one empty position between", () => {
            let layer = column.getLayers()[1]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 11, z: 0})
        })
        it("allows user defined layer spacing", () => {
            let config = Object.assign({}, testConfigs.oneColTwoLayers).corticalColumns[0];
            config.origin = {x: 0, y: 0, z: 0}
            config.spacing = 5
            const column = new CorticalColumn(config)
            let layer = column.getLayers()[1]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 15, z: 0})
        })
    })

    describe("when constructing a 3-layer column", () => {
        let config = Object.assign({}, testConfigs.oneColThreeLayers).corticalColumns[0];
        config.origin = {x: 0, y: 0, z: 0}
        const column = new CorticalColumn(config)
        it("creates the third layer above second layer with one empty position between", () => {
            let layer = column.getLayers()[2]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 12, z: 0})
        })
        it("allows user defined layer spacing", () => {
            let config = Object.assign({}, testConfigs.oneColThreeLayers).corticalColumns[0];
            config.origin = {x: 0, y: 0, z: 0}
            config.spacing = 5
            const column = new CorticalColumn(config)
            let layer = column.getLayers()[2]
            expect(layer.getOrigin()).to.deep.equal({x: 0, y: 20, z: 0})
        })
    })

})
