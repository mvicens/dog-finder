import { getFeature } from '../utils';
import features from '../assets/features.json';

function Filter({ item, groupIndex, filterIndex, updateFiltering }) {
	const feature = getFeature(item.feature);

	function deleteFilter() {
		updateFiltering(groups => groups[groupIndex].splice(filterIndex, 1));
	}

	function changeFilter(propName, value) {
		updateFiltering(groups => {
			const group = groups[groupIndex];
			if (propName == 'feature') {
				const filter = { feature: value },
					newFeature = getFeature(value);
				if (newFeature) {
					if (newFeature.isCategorical)
						filter.option = '';
					else {
						filter.minOption = newFeature.options[0];
						filter.maxOption = newFeature.options.at(-1);
					}
				}
				group[filterIndex] = filter;
			} else
				group[filterIndex][propName] = value;
		});
	}

	return (
		<article className='card text-bg-dark border-0 mb-3'>
			<div className='card-body p-1'>
				<div className='row'>
					<div className='col'>
						<div className='row row-cols-auto gx-1'>
							<div className='col'>
								<select className='form-select form-select-sm' value={item.feature} onChange={e => changeFilter('feature', e.target.value)}>
									<option value={''}>Choose field</option>
									{features.map(feature => <option key={feature.code} value={feature.code}>{feature.label}</option>)}
								</select>
							</div>
							{feature ? (
								feature.isCategorical ?
									(
										<>
											<div className='col'>
												<span>is</span>
											</div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.option} onChange={e => changeFilter('option', e.target.value)}>
													<option value={''}>Choose category</option>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
										</>
									)
									:
									(
										<>
											<div className='col'>
												<span>between</span>
											</div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.minOption} onChange={e => changeFilter('minOption', e.target.value)}>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
											<div className='col'>
												<span>and</span>
											</div>
											<div className='col'>
												<select className='form-select form-select-sm' value={item.maxOption} onChange={e => changeFilter('maxOption', e.target.value)}>
													{feature?.options.map(value => <option key={value} value={value}>{value}</option>)}
												</select>
											</div>
										</>
									)
							) : ''}
						</div>
					</div>
					<div className='col-auto'>
						<button className='btn btn-dark btn-sm' onClick={deleteFilter}>x</button>
					</div>
				</div>
			</div>
		</article>
	);
}

export default Filter;