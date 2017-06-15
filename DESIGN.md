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

To see the proposed API, build out the docs as described in the [README](README.md).

* * *

## Developer Notes

1. Synapses and Segments are missing from this model and may be added later.
1. There is no need for the parent-child relationship in the HTM network, but I have vague recollections that this would have been useful if I'd done it early on in previous projects, and it was easy to do at this point. If it causes complications, we should remove it.
