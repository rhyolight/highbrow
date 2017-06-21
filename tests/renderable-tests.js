const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect

const testConfigs = require("./config")

const Renderable = require("../src/renderable")
const HtmNetwork = require("../src/htm-network")

/*
Basic 3D translation.
*/

// Local mock implementation.
// class MockRenderable extends Renderable {
//     constructor(config, parent, testInsructions) {
//         super(config, parent)
//         this._testInstructions = testInsructions
//     }
//
//     getOrigin() {
//         throw new Error(
//             "MockRenderable was not provided instructions for getOrigin()"
//         )
//     }
//
//     getChildren() {
//         throw new Error(
//             "MockRenderable was not provided instructions for getChildren()"
//         )
//     }
//
// }

describe("HtmNetwork", () => {
    describe("upon construction", () => {
        it("defaults to an origin of 0,0,0", () => {
            let config = testConfigs.simple
            const network = new HtmNetwork(config)
            expect(network.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
        })
        it("saves origin if constructed with one", () => {
            let config = testConfigs.simple
            config.origin = {x: 1, y: 345, z: -94};
            const network = new HtmNetwork(config)
            expect(network.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })
})
