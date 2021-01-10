import React, {Component} from 'react';
import Animated from 'react-native-reanimated';
import {Path, PathProps} from 'react-native-svg';

class SvgPathWrap extends Component<PathProps> {
  private _component: React.Component<PathProps, any, any>;

  // eslint-disable-next-line @shopify/react-prefer-private-members
  public setNativeProps = props => {
    if (this._component) {
      (this._component as any).setNativeProps(props);
    }
  };

  render() {
    return (
      <Path
        ref={component => {
          this._component = component;
        }}
        {...this.props}
      />
    );
  }
}

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPathWrap);

export default AnimatedSvgPath;
