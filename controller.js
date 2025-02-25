const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const { db } = require("./firebase");

//user Signup
const handleSignUp = async (req, res) => {
  const userResponse = await admin.auth().createUser({
    email: req.body.email,
    password: req.body.password,
  });
  res.json(userResponse);
};

//userlogin
const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const userRecord = await getAuth().getUserByEmail(email);
    const customToken = await getAuth().createCustomToken(userRecord.uid);

    return res.status(200).json({
      success: true,
      message: "Custom token generated successfully",
      customToken,
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

//createTodo
const handleTodo = async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTodo = {
      title,
      userId,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db.collection("todos").add(newTodo);

    res.status(201).json({ message: "Todo added successfully", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//getAllTodos
const handleGetTodo = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching todos for userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const todosRef = db.collection("todos");
    const snapshot = await todosRef.where("userId", "==", userId).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No todos found for this user" });
    }

    let todos = [];
    snapshot.forEach(doc => {
      todos.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleSignUp, handleSignIn, handleTodo, handleGetTodo };
