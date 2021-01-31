import React from "react";
import { View } from "../../react-ape/reactApeEntry";

export const Row = props => {
  console.log("[Row.js] props", props);

  return <View style={props.style}>{props.children}</View>;
};

Row.defaultProps = {
  style: {}
};
