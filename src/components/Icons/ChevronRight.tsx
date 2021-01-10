import React from 'react';
import ChevronLeft, {Props} from './ChevronLeft';

function ChevronRight(props: Props) {
  return <ChevronLeft {...props} style={{transform: [{scaleX: -1}]}} />;
}

export default ChevronRight;
