function getRecordsFetch() {
	return fetch('http://localhost:4000')
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			return response.json();
		})
		.then(result => result.payload.map(item => {
			item.price = item.price.replace('$', '').replace(',', '');
			return item;
		}));
}

import features from './features.json';
for (const feature of features) {
	feature.isCategorical = Array.isArray(feature.options);
	if (!feature.isCategorical) {
		const options = feature.options,
			newOptions = [];
		for (let n = options.min; n <= options.max; n += options.step)
			newOptions.push(n);
		feature.options = newOptions;
	}
}

function getFeature(code) {
	return features.filter(feature => feature.code == code).at(0);
}

const numFormatter = new Intl.NumberFormat('en-US', {}),
	currFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', });

function getNumberFormat(n) {
	return numFormatter.format(n);
}

function getCurrencyFormat(n) {
	return currFormatter.format(n);
}

export { getRecordsFetch, getFeature, getNumberFormat, getCurrencyFormat };