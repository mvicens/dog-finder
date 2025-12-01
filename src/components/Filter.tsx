import { Filter as FilterType, Groups, FeatureName } from '../assets/types.ts';
import { features } from '../assets/utils';
import { Fragment } from 'react';

function Filter({ item, groupIndex, filterIndex, updateFiltering }: { item: FilterType, groupIndex: number, filterIndex: number, updateFiltering: (cb: (groups: Groups) => void) => void; }) {
	const feature = features.filter(feature => feature.name == item.feature).at(0);

	function deleteFilter() {
		updateFiltering((groups: Groups) => groups[groupIndex].splice(filterIndex, 1));
	}

	function changeFeature(value: string | FeatureName) {
		updateFiltering((groups: Groups) => {
			const group = groups[groupIndex];
			switch (value) {
				case 'eyeColor':
				case 'gender':
				case 'tags':
					group[filterIndex] = {
						feature: value,
						option: ''
					};
					break;
				case 'price':
				case 'age':
					{
						const feature = features.filter(feature => feature.name == value).at(0);
						if (!feature)
							return;
						const minOption = feature.options[0],
							maxOption = feature.options.at(-1);
						if (feature &&
							typeof minOption == 'number' &&
							typeof maxOption == 'number')
							group[filterIndex] = {
								feature: value,
								option: [minOption, maxOption]
							};
						break;
					}
				default:
					group[filterIndex] = { feature: '' };
			}
		});
	}

	function changeOption(value: string, i?: number) {
		updateFiltering((groups: Groups) => {
			const filter = groups[groupIndex][filterIndex];
			if (filter.feature != '') {
				if (i === undefined)
					filter.option = value;
				else if (filter.feature == 'price' || filter.feature == 'age')
					filter.option[i] = +value;
			}
		});
	}

	return (
		<article className='card text-bg-dark border-0 mb-3'>
			<div className='card-body p-2'>
				<div className='row'>
					<div className='col'>
						<div className='row row-cols-auto gx-3'>
							<div className='col'>
								<Select value={item.feature} onChange={changeFeature} list={features} options={['name', 'label']} label='Choose field' />
							</div>
							{item.feature && (
								['eyeColor', 'gender', 'tags'].includes(item.feature) ?
									(
										<>
											<div className='col'><span>is</span></div>
											<div className='col'>
												<Select value={item.option as string} onChange={changeOption} list={feature?.options} label='Choose category' />
											</div>
										</>
									)
									:
									['between', 'and'].map((text, i) => (
										<Fragment key={i}>
											<div className='col'><span>{text}</span></div>
											<div className='col'>
												<Select value={item.option[i] as string} onChange={(v: string) => changeOption(v, i)} list={feature?.options} />
											</div>
										</Fragment>
									))
							)}
						</div>
					</div>
					<div className='col-auto'>
						<button className='btn btn-light btn-sm' onClick={deleteFilter}>🗙</button>
					</div>
				</div>
			</div>
		</article >
	);
}

function Select({ value, onChange, list, options, label }: { value: string; onChange: (value: string | FeatureName) => void; list: undefined | (Record<string, unknown> | string | number)[]; options?: string[]; label?: string; }) {
	return (
		<select className='form-select form-select-sm' value={value} onChange={e => onChange(e.target.value)}>
			{label && <option value={''}>{label}</option>}
			{list && list.map(item => {
				const arr = options && typeof item === 'object' ? [item[options[0]], item[options[1]]] : [item],
					[value, label] = arr;
				if (typeof value !== 'string' && typeof value !== 'number')
					throw new Error('Value is not string nor is number');
				if (label !== undefined && typeof label !== 'string' && typeof label !== 'number')
					throw new Error('Defined label is not string nor is number');
				return <option key={value} value={value}>{label ?? value}</option>;
			})}
		</select>
	);
}

export default Filter;