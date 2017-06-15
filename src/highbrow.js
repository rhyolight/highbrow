/** @ignore */
const NeuronState = require("./enums").NeuronState
/** @ignore */
const MiniColumnState = require("./enums").MiniColumnState
/** @ignore */
const HtmLinkType = require("./enums").HtmLinkType
/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const HtmNetwork = require("./htm-network")
/** @ignore */
const HtmNetworkLink = require("./links").HtmNetworkLink

/**
 * This is a static entry class for Highbrow. It gets exported. You can use it
 * like this:
 * @example
 * let Highbrow = require("./src/highbrow")
 *
 *  let networkConfiguration = {
 *      name: "simple network example",
 *      corticalColumns: [{
 *          name: "column 1",
 *          layers: [
 *              {
 *                  name: "layer 1a",
 *                  miniColumns: false,
 *                  neuronCount: 8,
 *                  dimensions: {
 *                      x: 2, y: 2, z: 2
 *                  }
 *              }
 *          ]
 *      }]
 *  }
 *
 *  console.log("Neuron states:")
 *  console.log(Highbrow.getNeuronStates())
 *
 *  console.log("MiniColumn states:")
 *  console.log(Highbrow.getMiniColumnStates())
 *
 *  network = Highbrow.createHtmNetwork(networkConfiguration)
 *
 *  console.log(network.toString(verbose=true))
 *
 */
class Highbrow {

    /**
     * Creates a new {@link HtmNetwork} with the given configuration.
     * @param {Object} config
     */
    static createHtmNetwork(config) {
        return new HtmNetwork(config)
    }

    /**
     * @return {@link NeuronState}
     */
    static getNeuronStates() {
        return NeuronState
    }

    /**
     * @return {@link MiniColumnState}
     */
    static getMiniColumnStates() {
        return MiniColumnState
    }

    /**
     * @return {@link HtmLinkType}
     */
    static getHtmLinkTypes() {
        return HtmLinkType
    }
}

module.exports = Highbrow
