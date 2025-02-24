const { getAuth } = require("firebase-admin/auth");

const handleSignUp = async (req, res) => {
  const userResponse = await admin.auth().createUser({
    email: req.body.email,
    password: req.body.password,
  });
  res.json(userResponse);
};

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

module.exports = { handleSignUp, handleSignIn };
