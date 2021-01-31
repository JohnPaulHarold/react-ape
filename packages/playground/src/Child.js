import React from "react";
import { View } from "../../react-ape/reactApeEntry";

export const Child = props => {
  console.log("[Child.js] props", props);

  return <View style={props.style}>{props.children}</View>;
};

Child.defaultProps = {
  style: {}
};
