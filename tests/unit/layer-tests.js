const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const Layer = require("../../src/renderable")


describe("Layer Unit Tests", () => {

    describe("upon construction", () => {
        /* {
            name: "layer 1",
            miniColumns: false,
            neuronCount: 100,
            dimensions: {
                x: 10, y: 10, z: 1
            }
        } */
        let config = Object.assign({}, testConfigs.simple.corticalColumns[0].layers[0]);
        
    })

})
