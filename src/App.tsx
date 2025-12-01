import { Records, Groups } from './assets/types.ts';
import { useState, useEffect, Fragment } from 'react';
import { getRecordsFetch, getNumberFormat } from './assets/utils';
import Group from './components/Group';
import Record from './components/Record';

function App() {
	const [originalRecords, setOriginalRecords] = useState<Records | undefined | null>(undefined),
		[groups, setGroups] = useState<Groups>([]),
		[records, setRecords] = useState<Records>([]);

	useEffect(() => {
		getRecordsFetch()
			.then(records => setOriginalRecords(records))
			.catch(() => setOriginalRecords(null));
	}, []);

	useEffect(() => {
		if (!originalRecords)
			return;

		const usableGroups: Groups = [];
		for (let group of groups) {
			group = group.filter(filter => filter.feature && filter.option);
			if (group.length)
				usableGroups.push(group);
		}

		const records = originalRecords.filter(record => {
			return usableGroups.every(group => {
				return group.some(filter => {
					const featureName = filter.feature;
					if (featureName == '')
						return;
					const option = filter.option;
					if (['price', 'age'].includes(featureName)) {
						const value = record[featureName];
						return option[0] <= value && option[1] >= value;
					}
					if (featureName == 'tags')
						return record[featureName].some(v => v == option);
					return record[featureName] == option;
				});
			});
		});
		setRecords(records);
	}, [originalRecords, groups]);

	function addGroup() {
		updateFiltering((groups: Groups) => groups.push([
			{ feature: '' } // Initially one filter
		]));
	}

	function updateFiltering(cb: (groups: Groups) => void) {
		setGroups((groups: Groups) => {
			const newGroups = structuredClone(groups);
			cb(newGroups);
			return newGroups;
		});
	}

	if (!originalRecords) {
		if (originalRecords === null)
			return (
				<div className='container-fluid my-2'>
					<p className='alert alert-danger'>Error occurred!</p>
				</div>
			);
		return null;
	}

	let counterText = 'No dogs found';
	if (records.length) {
		const number = getNumberFormat(records.length);
		counterText = records.length == 1 ? number + ' dog found' : number + ' dogs found';
	}

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