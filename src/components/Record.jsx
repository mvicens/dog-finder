import { getFeature, getCurrencyFormat } from '../assets/utils';
import { Fragment } from 'react';

const features = [];
for (const name of ['gender', 'age', 'eyeColor'])
	features.push(getFeature(name));

function Record({ data }) {
	return (
		<article className='card text-bg-dark mb-3'>
			<div className='card-body'>
				<div className='clearfix'>
					<h3 className='card-title h5 float-start'>{data.name}</h3>
					<div className='text-white-50 float-end'>{getCurrencyFormat(data.price)}</div>
				</div>
				<img src={data.picture} alt={'Photo of ' + data.name} className='w-100 mb-2' />
				<div className='row'>
					<section className='col'>
						<dl className='row card-text'>
							{features.map(feature => (
								<Fragment key={feature.name}>
									<dt className='col-sm-6'>{feature.label}</dt>
									<dd className='col-sm-6 text-white-50 mb-0'>{data[feature.name]}</dd>
								</Fragment>
							))}
						</dl>
					</section>
					<section className='col'>
						<ul className='list-inline card-text'>
							{data.tags.map(tag => <li className='list-inline-item' key={tag}><span className='badge rounded-pill text-bg-info'>{tag}</span></li>)}
						</ul>
					</section>
				</div>
			</div>
		</article>
	);
}

export default Record;