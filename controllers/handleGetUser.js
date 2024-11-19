const {getDoc, doc} = require("firebase/firestore")
const {usersCollection} =  require("../db/firestore");



const handleGetUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userDoc = await getDoc(doc(usersCollection, id));
    if (!userDoc.exists()) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = handleGetUser;
