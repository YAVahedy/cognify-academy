import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const questions = db.collection("questions");

  if (req.method === "GET") {
    const allQuestions = await questions.find({}).toArray();
    res.status(200).json(allQuestions);
  }

  if (req.method === "POST") {
    const newQuestion = req.body;
    await questions.insertOne(newQuestion);
    res.status(201).json(newQuestion);
  }
}
