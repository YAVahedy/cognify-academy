import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  topicName: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  rating: { type: String, required: true },
  description: { type: String, default: 'Topic description goes here...' },  // Optional field for description
});

const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);

export default Topic;
