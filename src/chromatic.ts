import isChromatic from 'chromatic/isChromatic';
import { withGrid } from './components/Grids';
import { PARAM_KEY } from './constants';

export let parameters = {
	[PARAM_KEY]: {},
};

export let decorators = isChromatic() ? [withGrid] : [];
