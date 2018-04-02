# Lowbrow

> WebGL HTM 3D Translation Library

Currently under development. 

## Install

    npm install .

## Test

    npm test

## Build docs

    ./node_modules/.bin/esdoc
    open docs/index.html

## Build Bundle

    npm run build

Installs into `out/lowbrow-{X.Y.Z}.bundle.js`.

## Examples

### WEBGL

There is a simple WEBGL example in [`examples/webgl`](examples/webgl/). This example interfaces with [cell-viz](https://github.com/numenta/cell-viz), an existing platform I've used for HTM cell rendering in THREE.JS. For details, see [`HighbrowLayerVisualization`](https://github.com/numenta/cell-viz/blob/master/src/HighbrowLayerVisualization.js).

It currently only models one layer and is still missing key features, but if you open [`examples/webgl/index.html`](examples/webgl/index.html) in a browser and hold `s` to strafe backward you can see the animated cells with global indices and XYZ positions rendered upon them.

#### Controls

Use `wasd` to strafe and `←↑→↓` to rotate the camera. Hold `shift` to increase movement and rotation speed.
