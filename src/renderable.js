// Highbrow
// MIT License (see LICENSE)
// Copyright © 2005—2017 Numenta <http://numenta.com>

/** @ignore */
const DEFAULT_ORIGIN = {x: 0, y: 0, z: 0}

/**
 * Abstract base class for renderable objects. All renderable objects must
 * provide the following function implementations:
 * - {@link getOrigin}
 * - {@link getChildren}
 *
 * NOTE: The size of {@link Renderable} objects is not controlled by this API.
 * Clients of this API are responsible for sizing.
 */
class Renderable {
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
    constructor(config, parent = undefined, scale = 1.0,
                offset = {x:0, y:0, z:0}) {
        this._config = config
        this._parent = parent
        this._scale = scale
        this._offset = offset
        if (config.hasOwnProperty("origin")) {
            this._origin = config.origin
        } else {
            this._origin = DEFAULT_ORIGIN
        }
    }

    /**
     * @return {Object} Configuration object used to create this.
     */
    getConfig() {
        return this._config
    }

    getDimensions() {
        return this._config.dimensions
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
        return this._origin
    }

    /**
     * Changing the scale of of a {@link Renderable} will affect the origins of
     * children. Use {@link setOffset} with this function to reposition this
     * {@link Renderable}'s children.
     */
    setScale(scale = 1.0) {
        this._scale = scale
    }

    /**
     * @return {number} scale See {@link setScale}.
     */
    getScale() {
        return this._scale
    }

    /**
     * Moves the object in 3D space, will affect all point calculations. Can be
     * used to adjust for scale changes.
     * @param {number} x - X offset
     * @param {number} y - Y offset
     * @param {number} z - Z offset
     */
    setOffset(x = 0, y = 0, z = 0) {
        let offset = this._offset
        offset.x = x
        offset.y = y
        offset.z = z
    }

    /**
     * @return {Object} offset
     * @property {number} x x coordinate
     * @property {number} y y coordinate
     * @property {number} z z coordinate
     */
    getOffset() {
        return this._offset
    }

    /**
     * @return {string} The name of this object.
     */
    getName() {
        return this._config.name
    }

    getParent() {
        return this._parent
    }

    /**
     * How subclasses provide access to their children.
     *
     * @abstract
     * @return {Renderable[]} children
     */
    getChildren() {
        throw new Error(
            "Renderable Highbrow objects must provide getChildren()"
        )
    }

    getChildByName(name) {
        return this.getChildren().find(child => child.getName() == name)
    }


    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`
        let children = this.getChildren()
        if (children.length) {
            for (let child of children) {
                out += "\t" + child.toString(verbose).split("\n")
                                   .map(s => "\n\t" + s)
                                   .join("")
            }
        }
        return out
    }

}

module.exports = Renderable
