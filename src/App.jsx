import { useState, useEffect, Fragment } from 'react';
import { getRecordsFetch, getFeature, getNumberFormat } from './assets/utils';
import Group from './components/Group';
import Record from './components/Record';

let totalRecords = [];

function App() {
	const [isReady, setIsReady] = useState(false),
		[groups, setGroups] = useState([]),
		NO_AMOUNT_TEXT = 'No dogs found',
		[counterText, setCounterText] = useState(NO_AMOUNT_TEXT),
		[records, setRecords] = useState([]);

	useEffect(() => {
		getRecordsFetch().then(records => {
			if (!isReady) {
				totalRecords = records;
				setRecords(records);
				setIsReady(true);
			}
		});
	}, []);

	useEffect(() => {
		const records = totalRecords.filter(record => {
			for (const group of groups) {
				const definedFilters = group.filter(filter => filter.feature && (filter.option || filter.minOption));
				if (definedFilters.length) {
					const hasAnyMatch = definedFilters.some(filter => {
						const feature = getFeature(filter.feature);
						if (feature.isCategorical) {
							let value = record[feature.name];
							if (typeof value == 'string')
								value = [value];
							if (value.some(v => v == filter.option))
								return true;
						} else {
							const value = record[feature.name];
							if (filter.minOption <= value && filter.maxOption >= value)
								return true;
						}
					});
					if (!hasAnyMatch)
						return false;
				}
			}
			return true;
		});

		let counterText = NO_AMOUNT_TEXT;
		if (records.length) {
			const number = getNumberFormat(records.length);
			counterText = records.length == 1 ? number + ' dog found' : number + ' dogs found';
		}

		setCounterText(counterText);
		setRecords(records);
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

	if (!isReady)
		return null;
	return (
		<div className='container my-4'>
			<header>
				<h1 className='fw-bold text-center mb-4'>Dog Finder</h1>
			</header>
			<main>
				<div className='row'>
					<div className='col'>
						<div className='mb-4 invisible'>{counterText}</div>
						<section className='card text-bg-dark'>
							<div className='card-body'>
								<h2 className='card-title h6 text-center mb-3'>Filtering criteria</h2>
								{groups.map((group, index) => (
									<Fragment key={index}>
										{!!index && <div className='badge-container text-center mt-n3'><span className='badge text-bg-secondary text-uppercase'>and</span></div>}
										<Group item={group} index={index} updateFiltering={updateFiltering} />
									</Fragment>
								))}
								<button className='btn btn-dark w-100' onClick={addGroup}>Add group</button>
							</div>
						</section>
					</div>
					<section className='col'>
						<header>
							<h2 className='visually-hidden'>Filtered list</h2>
							<div className='text-center mb-4'>{counterText}</div>
						</header>
						{records.map(item => <Record key={item._id} data={item} />)}
					</section>
				</div>
			</main>
		</div>
	);
}

export default App;