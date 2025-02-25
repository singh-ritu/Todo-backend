const express = require("express");
const {
  handleSignUp,
  handleSignIn,
  handleTodo,
  handleGetTodo,
} = require("./controller");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", handleSignUp);
app.post("/login", handleSignIn);
app.post("/add-todo", handleTodo);
app.get("/get-todos/:userId", handleGetTodo);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
