import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@gmail.com',
		password: bcrypt.hashSync('letsgo123', 12),
		isAdmin: true,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
	{
		name: 'Vampo',
		email: 'Vampo@gmail.com',
		password: bcrypt.hashSync('letsgo123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
];

export default users;
