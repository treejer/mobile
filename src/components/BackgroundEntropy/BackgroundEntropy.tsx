import React, {useMemo} from 'react';
import Svg, {Path} from 'react-native-svg';
import {isWeb} from 'utilities/helpers/web';

function BackgroundEntropy() {
  const styles = useMemo(() => {
    const web = isWeb();
    return {
      up: {
        bottom: web ? 0 : -30,
        right: web ? 0 : -100,
      },
      down: {
        left: web ? 0 : -10,
        top: web ? 0 : -50,
      },
    };
  }, []);

  return (
    <>
      <Svg
        width="380"
        height="383"
        viewBox="0 0 380 383"
        style={{
          position: 'absolute',
          ...styles.up,
        }}
      >
        <Path
          d="M231 95.5137C267.4 -0.0863419 345.167 -5.98634 379.5 3.01366V382.514H0C16 232.514 89 210.014 116.5 208.514C144 207.014 185.5 215.014 231 95.5137Z"
          fill="#E5E7DB"
          fillOpacity="0.42"
        />
      </Svg>
      <Svg
        width="380"
        height="383"
        viewBox="0 0 380 383"
        style={{
          position: 'absolute',
          left: -10,
          top: -50,
          ...styles.down,
        }}
      >
        <Path
          d="M123.764 156.202C178.364 97.6818 131.743 27.4756 102.202 7.52527L24.4798 20.6697L0.268813 293.638C60.4732 184.166 69.165 214.723 123.764 156.202Z"
          fill="#E5E7DB"
          fillOpacity="0.42"
        />
      </Svg>
    </>
  );
}

export default BackgroundEntropy;
