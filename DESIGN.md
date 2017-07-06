# Highbrow Design Document

## Goals

1. Translate HTM state into a Cartesian 3D coordinate system
1. Allow multiple configurable Networks
1. Allow streaming or file-read HTM data feeds
1. Expose a clean interface for rendering engines to extract HTM features in 3D

```
                     HTM network
                     Configuration
                          +
                          |
                   +------v--------+       +---------------------+
   HTM State Data  |               |       |                     |
+------------------>    Highbrow   <-------+  Rendering Adapter  |
                   |               +------->                     |
                   +---------------+       +---------------------+

```

## Terms

### HTM Network Configuration

YAML configuration that is read on startup and used to configure the `HtmNetwork` instance. Must contain enough information to create an HTM structure.

### Rendering Adapter

Renders 3D visualization in an animation environment. This is the primary client for Highbrow, which is designed to be generic enough to render in multiple possible animation platforms (Unity, WEBGL, etc). See the proposed API below that any Rendering Adapters will use to extract 3D rendering details from Highbrow.

### HTM State Data

Data, either streaming or batched, that contains the state of the HTM system. Should be fed into Highbrow one row at a time. Once data has entered Highbrow, it will be exposed through the proposed API defined below.

> TODO: Define format of input "HTM State Data".

* * *


# Configuring an HTM Network for Highbrow

HTM Networks consists of CorticalColumns, Layers, Neurons, and (sometimes) MiniColumns. HTM Networks can be defined in a configuration file, which is enough information to render the structures in 3D. The configuration is a JSON object that looks like this:

```json
{
    name: "simple HtmNetwork",
    origin: {x:0, y:0, z:0},
    corticalColumns: [{
        name: "CorticalColumn 1",
        layers: [
            {
                name: "Layer 1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }
        ]
    }]
}
```

Each node in this tree represents a Renderable object. The top level is an HtmNetwork. It contains an array of `corticalColumns`. Each cortical column contains an array of `layers`.

Layers must have dimensions. The dimensions of CorticalColumns and HtmNetworks are calculated from the layers.

## Scale and Spacing

Scale is basically how large the rendering will be. You can think of it also has how big each neuron's renderable space is. By default it is 1 unit, which is pretty small in most spaces. A reasonable scale is `100`, which would give each neuron a space of 100x100x100 unit for rendering.

Spacing represents how much empty space will be between renderable objects. When spacing is applied to the CorticalColumn configuration, it affects how much space is between layers in the column. When applied to Layer configuration, it affects how much space is between Neurons in the Layer.

When applying scale and spacing, be sure to present the spacing values within the scale. For example, if your Layer scale is `100` and you want cells to be spaced with 1/2 a cell width between them, you should set the Layer spacing to `50`.

# Objects

## Neuron

Represents a pyramidal neuron. Neurons can be put into different states. Must be created with a `position` corresponding to its XYZ location in the layer cell grid. Neurons are created by their parent Layer objects, which decides its `origin` at time of creation.

To get the XYZ origin (the renderable 3D coordinate) of a Neuron, call `neuron.getOrigin()`. To get its position in the cellular grid within the layer, call `neuron.getPosition()`.

## Layer

A collection of Neurons. They might just be in an array, or structured into MiniColumns (TODO). Layers have X, Y, and Z dimensions. The Y dimension will represent MiniColumns, if they exist. Because there may be less neurons in the structure than the dimension allows, a `neuronCount` must be provided in the layer config. Layer configuration looks like this:

```json
{
    name: "layer 1",
    miniColumns: false,
    neuronCount: 100,
    dimensions: {
        x: 10, y: 10, z: 1
    }
}
```

## CorticalColumn

A collection of Layers. Each Layer will be positioned below the proceeding Layer to align the configuration and the visualization with biological reality (input comes into the bottom, moves upward). Configuration:

```json
{
    name: "column 1",
    layers: [...]
}
```

CorticalColumns are created by their parent HtmNetwork, and are assigned an origin point.

## HtmNetwork

An HtmNetwork is a collection of CorticalColumns. It must have an `origin` to be created.

```json
{
    name: "one column, two layers",
    origin: {x: 0, y: 0, z: 0},
    corticalColumns: [...]
}
```

* * *

## Developer Notes

1. Synapses and Segments are missing from this model and may be added later.
1. There is no need for the parent-child relationship in the HTM network, but I have vague recollections that this would have been useful if I'd done it early on in previous projects, and it was easy to do at this point. If it causes complications, we should remove it.
