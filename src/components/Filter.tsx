import { Filter as FilterType, Groups, FeatureName } from '../assets/types.ts';
import { features } from '../assets/utils';

function Filter({ item, groupIndex, filterIndex, updateFiltering }: { item: FilterType, groupIndex: number, filterIndex: number, updateFiltering: Function; }) {
	const feature = features.filter(feature => feature.name == item.feature).at(0);

	function deleteFilter() {
		updateFiltering((groups: Groups) => groups[groupIndex].splice(filterIndex, 1));
	}

	function changeFeature(value: '' | FeatureName) {
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
				default:
					group[filterIndex] = { feature: '' };
			}
		});
	}

	function changeOption(value: string, i: null | number) {
		updateFiltering((groups: Groups) => {
			const filter = groups[groupIndex][filterIndex];
			if (filter.feature !== '') {
				if (i === null)
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
								<select className='form-select form-select-sm' value={item.feature} onChange={e => changeFeature(e.target.value as '' | FeatureName)}>
									<option value={''}>Choose field</option>
									{features.map(feature => <option key={feature.name} value={feature.name}>{feature.label}</option>)}
								</select>
							</div>
							{item.feature && (
								['eyeColor', 'gender', 'tags'].includes(item.feature) ?
									(
										<>
											<div className='col'><span>is</span></div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.option as string} onChange={e => changeOption(e.target.value, null)}>
													<option value={''}>Choose category</option>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
										</>
									)
									:
									(
										<>
											<div className='col'><span>between</span></div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.option[0]} onChange={e => changeOption(e.target.value, 0)}>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
											<div className='col'><span>and</span></div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.option[1]} onChange={e => changeOption(e.target.value, 1)}>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
										</>
									)
							)}
						</div>
					</div>
					<div className='col-auto'>
						<button className='btn btn-light btn-sm' onClick={deleteFilter}>🗙</button>
					</div>
				</div>
			</div>
		</article>
	);
}

export default Filter;