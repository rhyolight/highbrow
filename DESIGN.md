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

# Proposed API

### `Highbrow`

Global drawing properties.

> NOTE: Changing the scale of the canvas will affect how tightly packed or spread out the `Points` returned by `Renderable` objects will be. All `Point` objects will have their coordinates multiplied by the scale (default `1.0`).

- `setScale(Point)` -- Sets the scale for drawing.
- `Point`:`getScale()` -- Get current scale for drawings.

### `Point`

3D point with `x`, `y`, `z` properties.

## State Objects

### `NeuronState` <small>(enum)</small>

All the different states a pyramidal `Neuron` may be in.

> TODO: Sometimes a neuron will be in more than one state at once. This either needs to define mixed states or Neuron's should be allowed to be in multiple states.

- `inactive`
- `active`
- `depolarized`
- `predicted`

### `MiniColumnState` <small>(enum)</small>

All the different states a `MiniColumn` may be in.

- `inactive`
- `active`

### `HtmConfiguration`

Wraps the YAML network configuration, used to instantiate `HtmNetwork`.

## Renderable Objects

### `Renderable` <small>(interface)</small>

Any discrete object that can be rendered.

- `Point`:`getOrigin` -- Denotes where the `Renderable` should be drawn.
- `setOrigin(Point)`

> NOTE: The size of `Renderable` objects is not controlled by this API. Rendering Adapters are responsible for sizing.


### `HtmNetwork` <small>(implements `Renderable`)</small>

Encapsulates all `Renderable` HTM components defined below.

- `constructor(HtmConfiguration)`
- `CorticalColumn[]`:`getCorticalColumns()`
- `HtmConfiguration`:`getConfig()`
- `HtmNetworkLink`:`getHtmNetworkLinks()` -- Gets all the links from all `Layer` objects in the network.
- `updateState(dataRow)` -- Sets a new state of the `HtmNetwork` given a new row of "HTM State Data" (loosely defined above).

### `HtmNetworkLink` <small>(implements `Renderable`)</small>

Links two `Layer` objects together one-directionally. There may be many links between the same `Layer` objects.

- `LinkType`:`getType()`
- `Layer`:`getFrom()` -- Where the link data originates.
- `Layer`:`getTo()` -- Where the link data terminates.

### `CorticalColumn` <small>(implements `Renderable`)</small>

- `Layer[]`:`getLayers()`

### `Layer` <small>(implements `Renderable`)</small>

- `Neuron[]`:`getNeurons()`
- `MiniColumn[]`:`getMiniColumns()` -- May return `[]` if `Layer` does not define mini columns.

> NOTE: `getNeurons()` will return all `Neurons` in the `Layer`, which can also be retrieved by calling `getMiniColumns()` and subsequently `getNeurons()` on each `MiniColumn` instance.

### `MiniColumn` <small>(implements `Renderable`)</small>

- `MiniColumnState`:`getState()`
- `Neuron[]`:`getNeurons()`

### `Neuron` <small>(implements `Renderable`)</small>

Atomic unit of Highbrow.

- `NeuronState`:`getState()`
- `int`:`getIndex()` -- The global index of this cell within the entire `Layer`.

* * *

## Notes

1. Synapses and Segments are missing from this model and may be added later.
