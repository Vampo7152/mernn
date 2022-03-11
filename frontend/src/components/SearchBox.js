import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('');

	// search for the keyword by redirecting to homepage with param
	const handleSearch = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};

	return (
		<Form onSubmit={handleSearch} className='d-flex'>
			{/* display searchbar inside navbar in large screens only */}
			<InputGroup className='mt-2'>
				<Form.Control
					type='text'
					style={{
						border: '2px solid #BABABA',
						borderRight: 'none',
					}}
					name='keyword'
					className='mr-sm-2 ml-sm-4'
					onChange={(e) => setKeyword(e.target.value)}
					placeholder='Search Iphone'
					value={keyword}
				/>
				<InputGroup.Text
					style={{
						background: 'white',
						border: '2px solid #BABABA',
						borderLeft: 'none',
					}}>
					<button
						aria-label='search'
						style={{
							margin: '0',
							border: '0',
							outline: '0',
							background: 'transparent',
							padding: '0',
						}}
						type='submit'>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#BABABA" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
					</button>
				</InputGroup.Text>
			</InputGroup>
		</Form>
	);
};

export default SearchBox;
