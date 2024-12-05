import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb'; // Import MongoDB connection function
import Topic from '@/models/Topic'; // Import Topic model
import mongoose from 'mongoose'; // Import mongoose for ObjectId handling
import styles from '../../styles/Topic.module.css';

const TopicPage = ({ topicData }) => {
    const router = useRouter();
    const { id } = router.query; // Getting the id from the URL

    if (!topicData) {
        return <div>Loading... Please wait.</div>; // Added more informative loading state
    }

    return (
        <div className={styles.container}>
            <Link href="/">
                <button className={styles.backButton}>←</button> 
            </Link>

            <h1 className={styles.title}>{topicData.topicName || id}</h1> 

            <div className={styles.content}>
                <div className={styles.text}>
                    <p>{topicData.description || 'Topic description goes here...'}</p>
                </div>

                <div className={styles.imageWrapper}> 
                    <Image
                        src={topicData.imageUrl || '/default-image.jpg'} 
                        alt={topicData.topicName || id}
                        width={300}
                        height={400}
                        className={styles.image}
                    />
                </div>
            </div>

            <button className={styles.takeTestButton}>Take The Test</button> 
        </div>
    );
};

// Pre-render only topics with rating >= 4.5
export async function getStaticPaths() {
    await connectDB();
    
    // Fetch topics with rating >= 4.5
    const topics = await Topic.find({ rating: { $gte: 4.5 } }).lean();

    // Generate paths using MongoDB's _id
    const paths = topics.map((topic) => ({
        params: { id: topic._id.toString() },  // Pass MongoDB _id as id in the path
    }));

    return {
        paths,
        fallback: true,  // true allows for fallback pages
    };
}

export async function getStaticProps({ params }) {
    await connectDB();

    // Ensure the id is converted to ObjectId for proper query
    const topic = await Topic.findById(new mongoose.Types.ObjectId(params.id)).lean(); // Explicit ObjectId conversion

    if (!topic) {
        return {
            notFound: true, // Return 404 if topic is not found
        };
    }

    const topicData = {
        topicName: topic.topicName,
        description: topic.description || 'Topic description goes here...',  // Use the description from the database
        imageUrl: topic.imageUrl,
    };

    return {
        props: {
            topicData,
        },
    };
}

export default TopicPage;
