/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const DEFAULT_ORIGIN = { x: 0, y: 0, z: 0

    /**
     * Abstract base class for renderable objects. All renderable objects must
     * provide the following function implementations:
     * - {@link getOrigin}
     * - {@link getChildren}
     *
     * NOTE: The size of {@link Renderable} objects is not controlled by this API.
     * Clients of this API are responsible for sizing.
     */
};class Renderable {
    /**
     * @param {Object} config - Contains all the details the Renderable needs to
     *        know to calculate origins for itself and its children.
     * @param {Renderable} parent - The parent Renderable object (optional).
     * @param {number} scale - Default 1.0, used for UI clients to scale the
     *        drawings.
     * @param {Object} offset - Moves the object in 3D space, will affect all
     *        point calculations. Can be used to adjust for `scale` changes.
     * @param {number} offset.x - X coordinate
     * @param {number} offset.y - Y coordinate
     * @param {number} offset.z - Z coordinate
     */
    constructor(config, parent = undefined, scale = 1.0, offset = { x: 0, y: 0, z: 0 }) {
        this._config = config;
        this._parent = parent;
        this._scale = scale;
        this._offset = offset;
        if (config.hasOwnProperty("origin")) {
            this._origin = config.origin;
        } else {
            this._origin = DEFAULT_ORIGIN;
        }
    }

    /**
     * @return {Object} Configuration object used to create this.
     */
    getConfig() {
        return this._config;
    }

    getDimensions() {
        return this._config.dimensions;
    }

    /**
     * Point of origin for this {@link Renderable} to be drawn in 3D.
     *
     * @return {Object} point with 3D coordinates
     * @property {number} x x coordinate
     * @property {number} y y coordinate
     * @property {number} z z coordinate
     */
    getOrigin() {
        return this._origin;
    }

    /**
     * Changing the scale of of a {@link Renderable} will affect the origins of
     * children. Use {@link setOffset} with this function to reposition this
     * {@link Renderable}'s children.
     */
    setScale(scale = 1.0) {
        this._scale = scale;
    }

    /**
     * @return {number} scale See {@link setScale}.
     */
    getScale() {
        return this._scale;
    }

    /**
     * Moves the object in 3D space, will affect all point calculations. Can be
     * used to adjust for scale changes.
     * @param {number} x - X offset
     * @param {number} y - Y offset
     * @param {number} z - Z offset
     */
    setOffset(x = 0, y = 0, z = 0) {
        let offset = this._offset;
        offset.x = x;
        offset.y = y;
        offset.z = z;
    }

    /**
     * @return {Object} offset
     * @property {number} x x coordinate
     * @property {number} y y coordinate
     * @property {number} z z coordinate
     */
    getOffset() {
        return this._offset;
    }

    /**
     * @return {string} The name of this object.
     */
    getName() {
        return this._config.name;
    }

    getParent() {
        return this._parent;
    }

    /**
     * How subclasses provide access to their children.
     *
     * @abstract
     * @return {Renderable[]} children
     */
    getChildren() {
        throw new Error("Renderable Highbrow objects must provide getChildren()");
    }

    getChildByName(name) {
        return this.getChildren().find(child => child.getName() == name);
    }

    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`;
        let children = this.getChildren();
        if (children.length) {
            for (let child of children) {
                out += "\t" + child.toString(verbose).split("\n").map(s => "\n\t" + s).join("");
            }
        }
        return out;
    }

}

module.exports = Renderable;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/**
 * All the states a neuron might be in.
 *
 * @todo Sometimes a neuron will be in more than one state at once. This either
 * needs to define mixed states or Neuron's should be allowed to be in multiple
 * states.
 */
const NeuronState = {
  inactive: "inactive",
  active: "active",
  depolarized: "depolarized"

  /**
   * All the states a mini-column might be in.
   */
};const MiniColumnState = {
  inactive: "inactive",
  active: "active"

  /**
   * The types of links layers can have between them.
   */
};const HtmLinkType = {
  apical: "apical",
  distal: "distal",
  proximal: "proximal"
};

module.exports = { NeuronState, MiniColumnState, HtmLinkType };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/**
 * @ignore Just a counter loop, including iterator.
 */
const times = n => f => {
    let iter = i => {
        if (i === n) return;
        f(i);
        iter(i + 1);
    };
    return iter(0);
};

module.exports = { times };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = __webpack_require__(0);
/** @ignore */
const times = __webpack_require__(2).times;
/** @ignore */
const NeuronState = __webpack_require__(1).NeuronState;

/*
 * Active cell indices returned from HTM systems generally are ordered with
 * mini-columns grouped together. Since we want to render mini-columns from top
 * to bottom, they need to be in the Y dimension, and that's why we translate
 * the cell indices into the Y dimension first.
 *
 * @param {integer} idx - global HTM cell index for neuron within layer
 * @param {integer} rx - range of the x dimension
 * @param {integer} ry - range of the y dimension
 * @param {integer} rz - range of the z dimension
 * @return {Object} point with 3D coordinates
 * @property {number} x x coordinate
 * @property {number} y y coordinate
 * @property {number} z z coordinate
 */
/** @ignore */
function getXyzFromIndex(idx, rx, ry, rz) {
    var result = {};
    var a = rz * ry;
    result.z = Math.floor(idx / a);
    var b = idx - a * result.z;
    result.x = Math.floor(b / rz);
    result.y = b % ry;
    return result;
}

/**
 * Represents a cortical layer within a {@link CorticalColumn}.
 */
class Layer extends Renderable {
    constructor(config, parent) {
        super(config, parent);
        this._buildLayer();
    }

    /**
     * This function accepts HTM state data and updates the positions and states
     * of all {@link Renderable} HTM components.
     *
     * @param {list} activeCellIndexes - integers for indexes of active cells.
     * @param {list} activeColumnIndexes - integers for indexes of active
     *        mini-columns.
     */
    update(activeCellIndexes, activeColumnIndexes) {
        let index = 0;
        for (let neuron of this.getNeurons()) {
            if (activeCellIndexes.includes(index)) {
                neuron.state = NeuronState.active;
            } else {
                neuron.state = NeuronState.inactive;
            }
            index++;
        }
    }

    /**
     * @override
     */
    getChildren() {
        return this.getNeurons();
    }

    getNeurons() {
        return this._neurons;
    }

    getNeuronByIndex(index) {
        return this.getNeurons().find(n => n.index == index);
    }

    getNeuronByXyz(x, y, z) {
        var dims = this.getDimensions();
        let globalIndex = z * dims.x * dims.y + x * dims.y + y;
        return this.getNeuronByIndex(globalIndex);
    }

    /**
     * @override
     */
    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`;
        if (verbose) {
            let children = this.getChildren();
            if (children.length) {
                for (let child of children) {
                    out += "\t" + child.toString().split("\n").map(s => "\n\t" + s).join("");
                }
            }
        } else {
            out += ` contains ${this._neurons.length} neurons`;
        }
        return out;
    }

    /*
     * Builds out the layer from scratch, using an Z,X,Y structure
     */
    _buildLayer() {
        this._neurons = [];
        times(this._config.neuronCount)(i => this._neurons.push(new Neuron({
            index: i,
            state: NeuronState.inactive,
            origin: getXyzFromIndex(i, this._config.dimensions.x, this._config.dimensions.y, this._config.dimensions.z)
        }, this)));
        if (this._config.miniColumns) {
            // TODO: implement minicolumns.
        }
    }

}

/**
 * Represents a mini-column within a {@link Layer}.
 */
class MiniColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent);
    }
}

/**
 * Represents a pyramidal neuron. The atomic unit of HTM computation.
 */
class Neuron extends Renderable {
    constructor(config, parent) {
        super(config, parent);
        this._state = NeuronState.inactive;
    }

    activate() {
        this._state = NeuronState.active;
    }

    deactivate() {
        this._state = NeuronState.inactive;
    }

    /**
     * @override NOOP
     * @returns [] empty list
     */
    getChildren() {
        return [];
    }

    /**
     * @override
     */
    getName() {
        return `${this.index} (${this.state})`;
    }

    /**
     * @override
     */
    toString() {
        let o = this.getOrigin();
        return `${this.getName()} at [${o.x}, ${o.y}, ${o.z}]`;
    }

    set state(state) {
        this._state = state;
    }

    get state() {
        return this._state;
    }

    // This index only changes if the config changes (unlikely).
    get index() {
        return this.getConfig()["index"];
    }

}

module.exports = Layer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = __webpack_require__(0);

/**
 * Represents data flow between {@link Layer}s.
 */
class HtmNetworkLink extends Renderable {
    /**
     * @param {Layer} to - Where link data originates.
     * @param {Layer} from - Where link data terminates.
     * @param {HtmLinkType} type - Type of link.
     */
    constructor(config, parent, from, to, type) {
        super(config, parent);
        this._from = from;
        this._to = to;
        this._type = type;
    }

    getOrigin() {
        throw new Error("Not implemented");
    }

    /**
     * @override noop, has no children.
     */
    getChildren() {
        return [];
    }

    /**
     * @return {Layer} Where the link data originates.
     */
    getFrom() {
        return this.getParent();
    }

    /**
     * @return {Layer} Where the link data terminates.
     */
    getTo() {
        return this.getChildren()[0];
    }

}

module.exports = HtmNetworkLink;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = __webpack_require__(0);
/** @ignore */
const Layer = __webpack_require__(3);

/**
 * Represents a cortical column.
 */
class CorticalColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent);
        this._layers = this._config.layers.map(config => {
            return new Layer(config, this);
        });
    }

    /**
     * This function accepts HTM state data and updates the
     * positions and states of all {@link Renderable} HTM components.
     *
     * @param {Object} data - I don't know what this is going to look like yet.
     */
    update(data) {
        for (let layerConfig of this.getConfig()['layers']) {
            // console.log(layerConfig)
            let layer = this.getChildByName(layerConfig.name);
            // console.log(layer.toString())
            let layerData = data[layerConfig.name];
            let activeCellIndexes = undefined;
            let activeColumnIndexes = undefined;
            // Handles if only cell data is sent
            if (Array.isArray(layerData)) {
                activeCellIndexes = layerData;
            } else {
                activeCellIndexes = layerData.activeCells;
                activeColumnIndexes = layerData.activeColumns;
            }
            layer.update(activeCellIndexes, activeColumnIndexes);
        }
    }

    /**
     * @override
     */
    getChildren() {
        return this.getLayers();
    }

    getLayers() {
        return this._layers;
    }

    /**
     * @return {HtmNetworkLink[]} All the links within this column. Does not
     *         return inter-column links. You must get those from the parent.
     */
    getHtmNetworkLinks() {
        let columnLinks = this.getCorticalColumns().map(c => {
            c.getHtmNetworkLinks();
        });
        return [].concat(...columnLinks);
    }
}

module.exports = CorticalColumn;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = __webpack_require__(0);
/** @ignore */
const CorticalColumn = __webpack_require__(5);

/**
 * Encapsulates all {@link Renderable} HTM components in the network.
 */
class HtmNetwork extends Renderable {
    constructor(config, parent) {
        super(config, parent);
        this._corticalColumns = this._config.corticalColumns.map(config => {
            // Attach the same origin as the parent, but a clone.
            config.origin = Object.assign({}, this.getOrigin());
            return new CorticalColumn(config, this);
        });
    }

    /**
     * This function accepts HTM state data and updates the positions and states
     * of all {@link Renderable} HTM components.
     * @param {Object} data - I don't know what this is going to look like yet.
     */
    update(data) {
        for (let columnConfig of this.getConfig()['corticalColumns']) {
            // console.log(columnConfig)
            let column = this.getChildByName(columnConfig.name);
            // console.log(column.toString())
            let columnData = data[columnConfig.name];
            column.update(columnData);
        }
    }

    /**
     * Provides access to all {@link CorticalColumn} children.
     * @override
     * @return {CorticalColumn[]} Cortical columns.
     */
    getChildren() {
        return this.getCorticalColumns();
    }

    /**
     * @return {CorticalColumn[]} Cortical columns.
     */
    getCorticalColumns() {
        return this._corticalColumns;
    }

    /**
     * @return {HtmNetworkLink[]} All the links in the whole network.
     */
    getHtmNetworkLinks() {
        let columnLinks = this.getCorticalColumns().map(c => {
            c.getHtmNetworkLinks();
        });
        return [].concat(...columnLinks);
    }

}

module.exports = HtmNetwork;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(0);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const NeuronState = __webpack_require__(1).NeuronState;
/** @ignore */
const MiniColumnState = __webpack_require__(1).MiniColumnState;
/** @ignore */
const HtmLinkType = __webpack_require__(1).HtmLinkType;
/** @ignore */
const Renderable = __webpack_require__(0);
/** @ignore */
const HtmNetwork = __webpack_require__(6);
/** @ignore */
const HtmNetworkLink = __webpack_require__(4).HtmNetworkLink;

/**
 * This is the top-level static entry class for Highbrow.
 */
class Highbrow {

    /**
     * Creates a new {@link HtmNetwork} with the given configuration.
     * @param {Object} config
     */
    static createHtmNetwork(config) {
        return new HtmNetwork(config);
    }

    /**
     * @return {@link NeuronState}
     */
    static getNeuronStates() {
        return NeuronState;
    }

    /**
     * @return {@link MiniColumnState}
     */
    static getMiniColumnStates() {
        return MiniColumnState;
    }

    /**
     * @return {@link HtmLinkType}
     */
    static getHtmLinkTypes() {
        return HtmLinkType;
    }
}
if (typeof window === 'undefined') {
    module.exports = Highbrow;
} else {
    window.Highbrow = Highbrow;
}

/***/ })
/******/ ]);