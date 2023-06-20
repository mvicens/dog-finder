import { Group as GroupType, Groups, Filter as FilterType } from '../assets/types.ts';
import { Fragment } from 'react';
import Filter from './Filter';

function Group({ item, index: groupIndex, updateFiltering }: { item: GroupType; index: number; updateFiltering: Function; }) {
	function deleteGroup() {
		updateFiltering((groups: Groups) => groups.splice(groupIndex, 1));
	}

	function addFilter() {
		updateFiltering((groups: Groups) => groups[groupIndex].push({ feature: '' }));
	}

	return (
		<article className='card text-bg-light mb-3'>
			<div className='card-body'>
				{item.map((filter: FilterType, filterIndex: number) => (
					<Fragment key={filterIndex}>
						{!!filterIndex && <div className='badge-container text-center mt-n3'><span className='badge text-bg-primary text-uppercase'>or</span></div>}
						<Filter item={filter} groupIndex={groupIndex} filterIndex={filterIndex} updateFiltering={updateFiltering} />
					</Fragment>
				))}
				{!item.length && <div className='text-center mb-3'>No filter</div>}
				<button className='btn btn-dark btn-sm' onClick={addFilter}>Add filter</button>
				<button className='btn btn-dark btn-sm float-end' onClick={deleteGroup}>Delete group</button>
			</div>
		</article>
	);
}

export default Group;