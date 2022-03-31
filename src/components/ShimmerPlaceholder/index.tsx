import LinearGradient from 'react-native-linear-gradient';
import RNShimmerPlaceholder, {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder: typeof RNShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default ShimmerPlaceHolder;
