import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

async function signUp(req, res) {
	const { userName, email, firstName, password, confirmPassword } = req.body;

	const userCheck = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (userCheck) return res.json({ error: 'Email already in use' });
	if (!confirmPassword || password != confirmPassword)
		return res.json({ message: "Passwords don't match" });

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				userName,
				email,
				firstName,
				password: hashedPassword,
			},
		});
		
		return res.json({ message: 'userCreated', user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function login(req, res) {
	const { email, password } = req.body;
	const user = await prisma.user.findFirst({
		where: {
			email: {
						contains: email,
						mode: 'insensitive',
					},
		},
	});

	if (!user) {
		return res.json({ error: 'Incorrect email' });
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) return res.json({ error: 'Incorrect password' });

	const token = jwt.sign(
		{
			user: {
				id: user.id,
				userName: user.userName,
			},
		},
		process.env.JWT_SECRET,
		{ expiresIn: '2hr' },
	);
	const { password: _, ...safeUser } = user;
	
	return res.json({ safeUser, token });
}

async function me(req, res) {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
		select: {
			id: true,
			userName: true,
			email: true,
			firstName: true,
			isPublic: true,
			profileImage: true,
			sentRequests: true,
			receivedRequests: {
				include: {
					receiver: { select: { userName: true } },
					requester: { select: { userName: true } },
				},
			},
		},
	});
	const token = jwt.sign(
		{
			user: {
				id: user.id,
				userName: user.userName,
			},
		},
		process.env.JWT_SECRET,
		{ expiresIn: '2hr' },
	);
	res.json({ safeUser: user, token });
}

export { signUp, login, me };
