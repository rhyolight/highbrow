const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect

const Highbrow = require("../src/highbrow")
const CorticalColumn = require("../src/cortical-column")
const HtmNetwork = require("../src/htm-network")

const simple = {
    name: "simple network",
    corticalColumns: [{
        name: "column1",
        layers: [
            {
                name: "inputLayer",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }
        ]
    }]
}

describe("Highbrow network factory", () => {
    describe("when creating a one column Network", () => {

        let network = Highbrow.createHtmNetwork(simple)

        it("returns an HtmNetwork object", () => {
            expect(network).to.be.instanceOf(HtmNetwork)
        })

        describe("HtmNetwork", () => {
            let columnTester = (columns) => {
                expect(columns).to.be.instanceOf(Array)
                for (let column of columns) {
                    expect(column).to.be.instanceOf(CorticalColumn)
                }
            }
            it("exposes CorticalColumns through getCorticalColumns", () => {
                columnTester(network.getCorticalColumns())
            })
            it("exposes CorticalColumns through getChildren", () => {
                columnTester(network.getChildren())
            })
        })
    })
})
