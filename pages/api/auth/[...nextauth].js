import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectDB from "../../../lib/mongodb"; // Import the Mongoose connect function
import User from "../../../models/User"; // Import User model
import bcrypt from "bcryptjs"; // Import bcrypt for password comparison

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB(); // Ensure DB is connected

        const user = await User.findOne({ email: credentials.email });

        // Validate user credentials using bcrypt for password comparison
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user._id, email: user.email }; // Return user info if credentials are correct
        } else {
          return null; // Invalid credentials
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(connectDB()), // Automatically connects to MongoDB using the clientPromise
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user id in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // Add user id to the session
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
