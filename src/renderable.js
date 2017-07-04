// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const CONFIG_DEFAULTS = {
    origin: {x:0, y:0, z:0},
    offset: {x:0, y:0, z:0},
    scale: 1.0,
    spacing: 1.0,
}

/**
 * Abstract base class for renderable objects. All renderable objects must
 * provide the following function implementations:
 * - {@link getChildren}
 *
 * NOTE: The size of {@link Renderable} objects is not controlled by this API.
 * Clients of this API are responsible for sizing.
 */
class Renderable {
    /**
     * @param {Object} config - Contains all the details the Renderable needs to
     *        know to calculate origins for itself and its children.
     * @param {float} config.scale - Scale of this renderable object.
     * @param {Renderable} parent - The parent Renderable object (optional).
     * @param {number} scale - Default 1.0, used for UI clients to scale the
     *        drawings.
     * @param {Object} offset - Moves the object in 3D space, will affect all
     *        point calculations. Can be used to adjust for `scale` changes.
     * @param {number} offset.x - X coordinate
     * @param {number} offset.y - Y coordinate
     * @param {number} offset.z - Z coordinate
     */
    constructor(config, parent = undefined) {
        this._config = config
        this._parent = parent
        this._scale = this._getConfigValueOrDefault("scale")
        this._offset = this._getConfigValueOrDefault("offset")
        this._origin = this._getConfigValueOrDefault("origin")
        this._spacing = this._getConfigValueOrDefault("spacing")
    }

    _getConfigValueOrDefault(name) {
        let out = CONFIG_DEFAULTS[name]
        if (this._config.hasOwnProperty(name)) {
            out = this._config[name]
        }
        return out
    }

    /**
     * @return {Object} Configuration object used to create this.
     */
    getConfig() {
        return this._config
    }

    getDimensions() {
        let dimensions = this._config.dimensions
        let scale = this.getScale()
        let dimensionsOut = {
            x: dimensions.x * scale,
            y: dimensions.y * scale,
            z: dimensions.z * scale,
        }
        return dimensionsOut
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
        let origin = this._origin
        let scale = this.getScale()
        let offset = this.getOffset()
        let originOut = {
            x: origin.x * scale + offset.x,
            y: origin.y * scale + offset.y,
            z: origin.z * scale + offset.z,
        }
        return originOut
    }

    /**
     * Changing the scale of of a {@link Renderable} will affect the origins of
     * children. Use {@link setOffset} with this function to reposition this
     * {@link Renderable}'s children.
     */
    setScale(scale) {
        this._scale = scale
        if (this.getChildren().length) {
            this.getChildren().forEach(child => { child.setScale(scale)})
        }
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

    getSpacing() {
        return this._spacing
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
     * How subclasses provide access to their {@link Renderable} children.
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
