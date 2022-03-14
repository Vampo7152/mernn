import mongoose from 'mongoose';

// a schema for stroing reviews for each product
const reviewsSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: { type: String, required: true },
		avatar: { type: String, required: true },
		rating: { type: Number, required: true, default: 0 },
		review: { type: String, required: true },
	},
	{ timestamps: true }
);


const sizeSchema = mongoose.Schema({
	size: {type:String, required:true},
	quantity:{type:Number,required:true,default:0}
})


const shoesizeSchema = mongoose.Schema({
	size: {type:Number, required:true},
	quantity:{type:Number,required:true,default:0}
})

const productSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		// store an array of review objs
		reviews: [reviewsSchema],
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},

		sizeStockCount: [{
			size: {type:String, required:true},
			quantity:{type:Number,required:true,default:0}
		}],
		ShoesizeStockCount: [{
				size: {type:Number, required:true},
				quantity:{type:Number,required:true,default:0}
		}],
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},

		isMembersOnly:{
			type: Boolean,
			required: true,
			default: false,
		}
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
