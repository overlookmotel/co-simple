/* --------------------
 * co-simple module
 * ------------------*/

'use strict';

// Exports
module.exports = fn => {
	return function() {
		const gen = fn.apply(this, arguments);

		return new Promise((resolve, reject) => {
			function step(key, arg) {
				let info, value;
				try {
					info = gen[key](arg);
					value = info.value;
				} catch (err) {
					return reject(err);
				}

				if (info.done) return resolve(value);

				return Promise.resolve(value).then(value => {
					step('next', value);
				}, err => {
					step('throw', err);
				});
			}

			step('next');
		});
	};
};
