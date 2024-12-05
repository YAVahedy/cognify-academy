import Head from 'next/head';
import Header from '@/components/home/header';
import Section from '@/components/home/Section';
import connectDB from '@/lib/mongodb'; // Import MongoDB connection function
import Topic from '@/models/Topic'; // Import Topic model
import { getSession } from 'next-auth/react'; // Import getSession for session check

export default function Home({ topics }) {
  return (
    <div className="container">
      <Head>
        <title>Home Page</title>
      </Head>
      <Header />
      <main>
        <h2>Welcome,</h2>
        <Section title="Based on your Interest" topics={topics} />
        <Section title="Continue from where you left" topics={topics} />
        <Section title="Try something new" topics={topics} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // Check if the user is logged in
  const session = await getSession({ req });

  if (!session) {
    // Redirect to the login page if not logged in
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Connect to the database
  await connectDB();  // Ensure the DB is connected

  // Fetch topics from MongoDB using Mongoose
  const topics = await Topic.find({}).lean();  // Using lean to get plain JavaScript objects

  // Pass topics as props to the page
  return {
    props: { topics: JSON.parse(JSON.stringify(topics)) },  // Converting topics to JSON to avoid issues with MongoDB ObjectId
  };
}
