import { useState, useEffect, Fragment } from 'react';
import { getRecordsFetch, getFeature, getNumberFormat } from './utils';
import Group from './components/Group';
import Record from './components/Record';

function App() {
	const [groups, setGroups] = useState([]),
		NO_AMOUNT_TEXT = 'No dogs found',
		[counterText, setCounterText] = useState(NO_AMOUNT_TEXT),
		[records, setRecords] = useState([]);

	useEffect(() => {
		getRecordsFetch()
			.then(data => data.filter(record => {
				for (const group of groups) {
					const definedFilters = group.filter(filter => filter.feature);
					if (definedFilters.length) {
						const hasAnyMatch = definedFilters.some(filter => {
							const feature = getFeature(filter.feature);
							if (feature.isCategorical) {
								let value = record[feature.propName];
								if (typeof value == 'string')
									value = [value];
								if (value.some(v => v == filter.option))
									return true;
							} else {
								const value = record[feature.propName];
								if (filter.minOption <= value && filter.maxOption >= value)
									return true;
							}
						});
						if (!hasAnyMatch)
							return false;
					}
				}
				return true;
			}))
			.then(records => {
				let counterText = NO_AMOUNT_TEXT;
				if (records.length) {
					const number = getNumberFormat(records.length);
					counterText = records.length == 1 ? number + ' dog found' : number + ' dogs found';
				}

				setCounterText(counterText);
				setRecords(records);
			});
	}, [groups]);

	function addGroup() {
		updateFiltering(groups => groups.push([
			{ feature: '' } // Initially one filter
		]));
	}

	function updateFiltering(cb) {
		setGroups(groups => {
			const newGroups = structuredClone(groups);
			cb(newGroups);
			return newGroups;
		});
	}

	return (
		<div className='container'>
			<header>
				<h1 className='h3'>Dog Finder</h1>
			</header>
			<main>
				<div className='row'>
					<div className='col'>
						<section className='card'>
							<div className='card-body'>
								<h2 className='card-title h6'>Filtering criteria</h2>
								{groups.map((group, index) => (
									<Fragment key={index}>
										{index ? <span className='badge bg-secondary'>and</span> : ''}
										<Group item={group} index={index} updateFiltering={updateFiltering} />
									</Fragment>
								))}
								<button type='button' className='btn btn-secondary w-100' onClick={addGroup}>Add group</button>
							</div>
						</section>
					</div>
					<section className='col'>
						<header>
							<h2 className='visually-hidden'>Filtered list</h2>
							<div>{counterText}</div>
						</header>
						{records.map(item => <Record key={item._id} data={item} />)}
					</section>
				</div>
			</main>
		</div>
	);
}

export default App;