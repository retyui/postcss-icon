import { plugin } from 'postcss';

export default plugin('postcss-animations', (/* options={} */) => {

	return css => {
		css.walkDecls('icon', (/* decl */) => { // Find all `icon: <icon-name>; declaration`

			// extend
		});
	};
});
