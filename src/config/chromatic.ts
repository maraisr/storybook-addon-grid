import isChromatic from 'chromatic/isChromatic';
import { withGrid } from '../components/Grids';

export { parameters } from '.';

export const decorators = isChromatic() ? [withGrid] : [];
