import { OriginalRecord, Features, CategoricalFeatureName, QuantitativeFeatureName } from './types.ts';

function getRecordsFetch() {
	return fetch('http://localhost:4000')
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			return response.json();
		})
		.then(result => result.payload.map((item: OriginalRecord) => {
			item.price = item.price.replace('$', '').replace(',', '');
			return item;
		}));
}

const features: Features = [];

import categoricalFeatures from './features/categorical.json';
for (const feature of categoricalFeatures) {
	const { name } = feature;
	assertCategoricalName(name);
	features.push({
		...feature,
		name
	});
}

import quantitativeFeatures from './features/quantitative.json';
for (const feature of quantitativeFeatures) {
	const { name, options } = feature;
	assertQuantitativeName(name);

	const newOptions = [];
	for (let n = options.min; n <= options.max; n += options.step)
		newOptions.push(n);

	features.push({
		...feature,
		name,
		options: newOptions
	});
}

function assertCategoricalName(value: string): asserts value is CategoricalFeatureName {
	if (!['eyeColor', 'gender', 'tags'].includes(value))
		throw new Error(`${value} is not categorical`);
}

function assertQuantitativeName(value: string): asserts value is QuantitativeFeatureName {
	if (!['price', 'age'].includes(value))
		throw new Error(`${value} is not quantitative`);
}

const numFormatter = new Intl.NumberFormat('en-US', {}),
	currFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', });

function getNumberFormat(n: number) {
	return numFormatter.format(n);
}

function getCurrencyFormat(n: number) {
	return currFormatter.format(n);
}

export { getRecordsFetch, features, getNumberFormat, getCurrencyFormat };