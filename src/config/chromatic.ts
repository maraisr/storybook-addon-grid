import isChromatic from 'chromatic/isChromatic';
import { withGrid } from '../components/Grids';
import { PARAM_KEY } from '../constants';

export const parameters = {
	[PARAM_KEY]: {
		animation: false,
	},
};

export const decorators = isChromatic() ? [withGrid] : [];
