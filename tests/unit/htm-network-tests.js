const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const HtmNetwork = require("../../src/htm-network")

describe("HtmNetwork Unit Tests", () => {

    describe("when constructing a simple network", () => {
        let config = Object.assign({}, testConfigs.simple);
        config.origin = {x: 1, y: 345, z: -94};
        const network = new HtmNetwork(config)
        it("creates the column at the same origin as itself", () => {
            var column = network.getCorticalColumns()[0]
            expect(column.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })

})
