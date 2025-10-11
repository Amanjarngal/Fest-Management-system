const { auth } = require("../config/firebase");

const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role: "admin" });

    res.json({ message: `Admin role granted to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { makeAdmin };
