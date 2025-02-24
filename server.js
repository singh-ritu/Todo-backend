const express = require("express");
const { handleSignUp, handleSignIn } = require("./controller");
const admin = require("firebase-admin");
const app = express();

const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", handleSignUp);
app.post("/login", handleSignIn);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
