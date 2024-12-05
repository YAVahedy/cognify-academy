import connectDB from '../../lib/mongodb'; // Correct import
import bcrypt from 'bcryptjs';
import User from '../../models/User'; // Import User model

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            await connectDB();  // Ensure DB is connected

            // Check if the user already exists using Mongoose
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

            // Create a new user and save to the DB using Mongoose
            const newUser = new User({
                email,
                password: hashedPassword,
                createdAt: new Date(),
            });

            await newUser.save();  // Save the user to the DB

            return res.status(201).json({ message: 'Account created successfully' });
        } catch (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({ error: 'Error creating account' });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}
