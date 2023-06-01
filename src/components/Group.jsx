import { Fragment } from 'react';
import Filter from './Filter';

function Group({ item, index: groupIndex, updateFiltering }) {
	function deleteGroup() {
		updateFiltering(groups => groups.splice(groupIndex, 1));
	}

	function addFilter() {
		updateFiltering(groups => groups[groupIndex].push({ feature: '' }));
	}

	return (
		<article className='card'>
			<div className='card-body'>
				{item.map((filter, filterIndex) => (
					<Fragment key={filterIndex}>
						{filterIndex ? <div className='text-center'><span className='badge bg-secondary'>or</span></div> : ''}
						<Filter item={filter} groupIndex={groupIndex} filterIndex={filterIndex} updateFiltering={updateFiltering} />
					</Fragment>
				))}
				<button type='button' className='btn btn-secondary btn-sm' onClick={addFilter}>Add filter</button>
				<button type='button' className='btn btn-secondary btn-sm float-end' onClick={deleteGroup}>Delete group</button>
			</div>
		</article>
	);
}

export default Group;