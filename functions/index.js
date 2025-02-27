const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.createTodo = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, task } = req.body;

    if (!userId || !task) {
      return res.status(400).json({ error: "Missing userId or task" });
    }

    const todoRef = await db.collection("todos").add({
      userId,
      task,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Todo created!", id: todoRef.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
