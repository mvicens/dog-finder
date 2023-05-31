import { getFeature, getCurrencyFormat } from '../utils';
import { Fragment } from 'react';

const features = [];
for (const code of ['G', 'A', 'E'])
	features.push(getFeature(code));

function Record({ data }) {
	return (
		<article className='card'>
			<div className='card-body'>
				<div className='clearfix'>
					<h3 className='card-title h5 float-start'>{data.name}</h3>
					<div className='float-end'>{getCurrencyFormat(data.price)}</div>
				</div>
				<img src={data.picture} alt={'Photo of ' + data.name} />
				<div className='row'>
					<section className='col'>
						<dl className='row card-text'>
							{features.map(feature => (
								<Fragment key={feature.code}>
									<dt className='col-sm-6'>{feature.label}</dt>
									<dd className='col-sm-6'>{data[feature.propName]}</dd>
								</Fragment>
							))}
						</dl>
					</section>
					<section className='col'>
						<ul className='list-inline card-text'>
							{data.tags.map(tag => <li className='list-inline-item' key={tag}><span className='badge bg-secondary'>{tag}</span></li>)}
						</ul>
					</section>
				</div>
			</div>
		</article>
	);
}

export default Record;