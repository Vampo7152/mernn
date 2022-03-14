import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { refreshLogin, getUserDetails } from '../actions/userActions';

import FormContainer from '../components/FormContainer';

const ProductEditPage = ({ match, history }) => {
	// all variable for stroing product details
	const productId = match.params.id;
	const [name, setName] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('T-Shirts');
	const [description, setDescription] = useState('');
	const [images, setImages] = useState(['']);
	const [price, setPrice] = useState(0.0);
	const [countInStock, setCountInStock] = useState(0);
	const [isMembersOnly, setMembersOnlyStatus] = useState(false);

	const [sizeStockCount, setSizeStockCount] = useState([
		{size:"S", quantity:0},
		{size:"M", quantity:0},
		{size:"L", quantity:0},
		{size:"XL", quantity:0},
		{size:"XXL", quantity:0},
		{size:"3XL", quantity:0},
	])



	const [ShoesizeStockCount, setShoesizeStockCountSizeStockCount] = useState([
		{size:2, quantity:0},
		{size:3, quantity:0},
		{size:4, quantity:0},
		{size:5, quantity:0},
		{size:6, quantity:0},
		{size:7, quantity:0},
		{size:8, quantity:0},
		{size:9, quantity:0},
		{size:10, quantity:0},
		{size:11, quantity:0},
	])


	// to upload product image
	const [uploading, setUploading] = useState(false);
	const [errorImageUpload, setErrorImageUpload] = useState('');
	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, product, error } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = productUpdate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// fetch user login details
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// fetch new access tokens if user details fail, using the refresh token
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listProductDetails(productId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// update the product details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				if(product.category === "Caps"){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setCountInStock(product.countInStock);
					setMembersOnlyStatus(product.isMembersOnly);
				}
				else if(product.category==="Shoes"){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setShoesizeStockCountSizeStockCount(product.ShoesizeStockCount)
					setMembersOnlyStatus(product.isMembersOnly);
				}
				else if(product.category === "T-Shirts" ||product.category === "Hoodies" ){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setSizeStockCount(product.sizeStockCount);
					setMembersOnlyStatus(product.isMembersOnly);
				}

				
			}
		}
	}, [product, dispatch, productId, history, successUpdate]);

	// submit the product details
	const handleSubmit = (e) => {
		console.log(sizeStockCount)
		
		e.preventDefault();
	
			dispatch(
				updateProduct({
					_id: productId,
					name,
					brand,
					price,
					category,
					description,
					countInStock,
					ShoesizeStockCount,
					sizeStockCount,
					isMembersOnly,
					images,
				})
			);
		
	};

	// for image input, use a ref
	const inputFile = useRef(null);

	// click the above ref, to handle the overlay div above the product image
	const handleImageClick = () => {
		inputFile.current.click();
	};


	//handling membersonly Status

	const membersOnlyHandler = (event) =>{

		const tempMemberStatus = event.target.value
		
		setMembersOnlyStatus(tempMemberStatus)
	
	}


	// submit file to aws bucket, get the url
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post('/api/upload', formData, config);
			setImages(data);
			setUploading(false);
		} catch (error) {
			setErrorImageUpload('Please choose a valid image');
			setUploading(false);
		}
	};

	return (
		<>
			<Link to='/admin/productlist'>
				<Button variant='outline-primary' className='mt-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer style={{ marginTop: '-2em' }}>
				<h1>Edit Product</h1>
				{loadingUpdate ? (
					<Loader />
				) : errorUpdate ? (
					<Message dismissible variant='danger' duration={10}>
						{errorUpdate}
					</Message>
				) : (
					<>
						{loading ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit}>
								{error && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{error}
									</Message>
								)}
								<Form.Group controlId='name'>
									<FloatingLabel
										controlId='nameinput'
										label='Name'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Name'
											type='text'
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='price'>
									<FloatingLabel
										controlId='priceinput'
										label='Price'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter price'
											type='number'
											value={price}
											min='0'
											max='1000'
											step='0.1'
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								{errorImageUpload && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{errorImageUpload}
									</Message>
								)}
								{uploading ? (
									<div>Uploading...</div>
								) : (
									<Form.Group controlId='image'>
										<Row>
											<Col md={9}>
												<FloatingLabel
													controlId='imageinput'
													label='Image URL'
													className='mb-3'>
													<Form.Control
														size='lg'
														placeholder='Enter image URL'
														type='text'
														value={images}
														onChange={(e) =>
															setImages(
																e.target.value
															)
														}
													/>
												</FloatingLabel>
											</Col>
											<Col md={3}>
												<input
													accept='image/*'
													type='file'
													id='file'
													ref={inputFile}
													onChange={handleFileUpload}
													style={{ display: 'none' }}
												/>
												<div
													className='profile-page-image'
													style={{
														alignSelf: 'center',
													}}>
													<Image
														src={images}
														alt={name}
														title='Click to input file'
														style={{
															width: '100%',
															border: '1px solid #ced4da',
															marginBottom: '1em',
															cursor: 'pointer',
															borderRadius:
																'0.25rem',
														}}
													/>
													<div
														className='image-overlay-product'
														onClick={
															handleImageClick
														}>
														Click to upload image
													</div>
												</div>
											</Col>
										</Row>
									</Form.Group>
								)}
								<Form.Group controlId='brand'>
									<FloatingLabel
										controlId='brandinput'
										label='Brand'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter brand'
											type='text'
											value={brand}
											onChange={(e) =>
												setBrand(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='category'>
									<FloatingLabel
										controlId='categoryinput'
										label='Category'
										className='mb-3'>
										<Form.Select
											size='lg'
											placeholder='Select category'
											type='text'
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
											}
										>
											<option value="null">Select a category</option>
											<option value="T-Shirts">T-Shirts</option>
											<option value="Hoodies">Hoodies</option>
											<option value="Caps">Caps</option>
											<option value="Shoes">Shoes</option>

										</Form.Select>
									</FloatingLabel>
								</Form.Group>

							
								{
									category === "T-Shirts" && (
										
								<Form.Group controlId='T-Shirt Sizes'>
								<FloatingLabel
									controlId='tshirtInput'
									label='Enter Quantity For Tshirt Sizes'
									className='mb-3'>
									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[0].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[0].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[0]}
											tempItem.quantity = e.target.value
											temp[0] = tempItem
											setSizeStockCount(temp)
							
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[1].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[1].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[1]}
											tempItem.quantity = e.target.value
											temp[1] = tempItem
											setSizeStockCount(temp)
								
											
										}}	
									
									/>




										<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[2].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[2].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[2]}
											tempItem.quantity = e.target.value
											temp[2] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[3].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[3].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[3]}
											tempItem.quantity = e.target.value
											temp[3] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>



<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[4].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[4].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[4]}
											tempItem.quantity = e.target.value
											temp[4] = tempItem
											setSizeStockCount(temp)
					
											
										}}	
									
									/>


<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[5].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[5].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[5]}
											tempItem.quantity = e.target.value
											temp[5] = tempItem
											setSizeStockCount(temp)
							
											
										}}	
									
									/>
										

								</FloatingLabel>
							</Form.Group>
									)
								}



								{ category === "Hoodies" && (
										
								<Form.Group controlId='hoodie'>
								<FloatingLabel
									controlId='hoodieInput'
									label='Enter Quantity For Hoodie Sizes'
									className='mb-3'>
									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[0].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[0].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[0]}
											tempItem.quantity = e.target.value
											temp[0] = tempItem
											setSizeStockCount(temp)
			
										}}		
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[1].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[1].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[1]}
											tempItem.quantity = e.target.value
											temp[1] = tempItem
											setSizeStockCount(temp)
						
											
										}}	
									
									/>




										<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[2].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[2].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[2]}
											tempItem.quantity = e.target.value
											temp[2] = tempItem
											setSizeStockCount(temp)
						
											
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[3].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[3].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[3]}
											tempItem.quantity = e.target.value
											temp[3] = tempItem
											setSizeStockCount(temp)
										
										}}	
									
									/>



<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[4].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[4].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[4]}
											tempItem.quantity = e.target.value
											temp[4] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>


<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[5].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[5].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[5]}
											tempItem.quantity = e.target.value
											temp[5] = tempItem
											setSizeStockCount(temp)
								
											
										}}	
									
									/>
										

								</FloatingLabel>
								</Form.Group>
								)}



								{ category === "Shoes" && (
										
										<Form.Group controlId='Shoes'>
										<FloatingLabel
											controlId='shoeInput'
											label='Enter Quantity For Shoe Sizes'
											className='mb-3'>
											
						
											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[0].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[0].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[0]}
													tempItem.quantity = e.target.value
													temp[0] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>




											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[1].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[1].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[1]}
													tempItem.quantity = e.target.value
													temp[1] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
									
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[2].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[2].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[2]}
													tempItem.quantity = e.target.value
													temp[2] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[3].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[3].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[3]}
													tempItem.quantity = e.target.value
													temp[3] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[4].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[4].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[4]}
													tempItem.quantity = e.target.value
													temp[4] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>
										




										<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[5].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[5].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[5]}
													tempItem.quantity = e.target.value
													temp[5] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>




											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[6].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[6].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[6]}
													tempItem.quantity = e.target.value
													temp[6] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
									
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[7].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[7].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[7]}
													tempItem.quantity = e.target.value
													temp[7] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
						
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[8].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[8].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[8]}
													tempItem.quantity = e.target.value
													temp[8] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[9].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[9].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[9]}
													tempItem.quantity = e.target.value
													temp[9] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>
											
										
											
												
		
										</FloatingLabel>
										</Form.Group>
										)}


								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={description}
											onChange={(e) =>
												setDescription(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								
								
								{category === "Caps" && (

								<Form.Group controlId='countInStock'>
								<FloatingLabel
									controlId='countinstockinput'
									label='CountInStock'
									className='mb-3'>
									<Form.Control
										size='lg'
										placeholder='Enter Count In Stock'
										type='number'
										min='0'
										max='1000'
										value={countInStock}
										onChange={(e) =>
											setCountInStock(e.target.value)
										}
									/>
								</FloatingLabel>

								</Form.Group>


								)}


				

								<Form.Group controlId='isMembersOnly'>
									<FloatingLabel
										controlId='membersOnlyInput'
										label='Is this product members only?'
										className='mb-3'>
										<Form.Select
											size='lg'
											placeholder='Set Members Only Status'
											value={isMembersOnly}
											onChange={membersOnlyHandler}
										>
											<option value="false">No</option>
											<option value="true">Yes</option>

										</Form.Select>
									</FloatingLabel>




								</Form.Group>

								
								<div className='d-flex'>
									<Button
										type='submit'
										className='my-1 ms-auto'>
										Update Product
									</Button>
								</div>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditPage;
