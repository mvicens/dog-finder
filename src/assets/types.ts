export type Records = Record[];
export type Record = Omit<OriginalRecord, 'price'> & { price: number; };
export type OriginalRecord = {
	_id: string;
	name: string;
	price: string;
	picture: string;
	age: number;
	eyeColor: string;
	gender: string;
	tags: string[];
};

export type Groups = Group[];
export type Group = Filter[];
export type Filter =
	| { feature: ''; }
	| {
		feature: CategoricalFeatureName;
		option: string;
	}
	| {
		feature: QuantitativeFeatureName;
		option: [number, number];
	};

export type Features = Feature[];
export type Feature =
	| {
		name: CategoricalFeatureName;
		label: string;
		options: string[];
	}
	| {
		name: QuantitativeFeatureName;
		label: string;
		options: number[];
	};

export type FeatureName = CategoricalFeatureName | QuantitativeFeatureName;
export type CategoricalFeatureName = 'eyeColor' | 'gender' | 'tags';
export type QuantitativeFeatureName = 'price' | 'age';