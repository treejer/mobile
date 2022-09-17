import {isWeb} from 'utilities/helpers/web';

export const screenTitle = text => (isWeb() ? `Ranger | ${text}` : text);
