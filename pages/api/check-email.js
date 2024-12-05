import connectDB from '../../lib/mongodb'; // Correct import statement
import User from '../../models/User'; // Import User model

export default async function handler(req, res) {
    const { email } = req.body;  // Get the email from the request body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await connectDB();  // Ensure DB is connected

        // Check if a user with the provided email exists using Mongoose
        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ exists: true });  // Email exists
        } else {
            return res.status(200).json({ exists: false }); // Email does not exist
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Error checking email' });
    }
}
