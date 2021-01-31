/**
 * Copyright (c) 2018-present, Raphael Amorim.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defaultViewSize } from "../constants";

class View {
  constructor(props) {
    this.props = props;
    this.type = "View";
    this.spatialGeometry = {};
    this.renderQueue = [];
  }

  appendChild(fn) {
    // console.log("[appendChild] fn %o", fn);
    this.renderQueue.push(fn);
  }

  getLayoutDefinitions = () => {
    return {
      style: {
        backgroundColor: "white",
        borderColor: "white",
        ...(this.props.style || {})
      },
      spatialGeometry: this.spatialGeometry
    };
  };

  children() {
    return this.renderQueue;
  }

  clear() {
    // noop
  }

  render(apeContext, layoutDefs) {
    console.log("[render] apeContext %o layoutDefs %o", apeContext, layoutDefs);

    // console.log("[render] renderQueue", this.renderQueue);

    const { ctx, getSurfaceHeight, setSurfaceHeight } = apeContext;
    const { style = {}, children } = this.props;

    const previousStroke = ctx.strokeStyle;
    let x = style.x || style.left || 0; // legacy support
    let y = style.y || style.top || 0; // legacy support

    // add the parent x,y offset to the child x,y
    if (layoutDefs) {
      const { spatialGeometry } = layoutDefs;
      x += spatialGeometry.x;
      y += spatialGeometry.y;
    }

    const width = style.width || defaultViewSize;
    const height = style.height || defaultViewSize;

    console.log("[render] children", children);

    if (!style.position || style.position === "relative") {
      const surfaceHeight = getSurfaceHeight();
      console.log(
        "[render] surfaceHeight %o props %o",
        surfaceHeight,
        this.props
      );
      y = surfaceHeight;

      // seems that `Text` components are a bit special?
      if (children && children.type !== "Text") {
        setSurfaceHeight(surfaceHeight);
      } else {
        setSurfaceHeight(surfaceHeight + height);
      }
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = style.borderColor || "transparent";
    ctx.fillStyle = style.backgroundColor || "transparent";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Reset Context
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = previousStroke;

    this.spatialGeometry = { x, y };

    const callRenderFunctions = renderFunction => {
      if (renderFunction.render) {
        renderFunction.render(
          apeContext,
          // spatialGeometry: specific data for elements rendered inside the View
          this.getLayoutDefinitions()
        );
      }
      // renderFunction.render
      //   ? renderFunction.render(
      //       apeContext,
      //       // spatialGeometry: specific data for elements rendered inside the View
      //       this.getLayoutDefinitions()
      //     )
      //   : null;
    };

    this.renderQueue.forEach(callRenderFunctions);
  }
}

export default View;
