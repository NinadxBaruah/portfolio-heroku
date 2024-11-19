const {getDocs} = require("firebase/firestore");
const { usersCollection } =  require("../db/firestore");

const handleGetAllUsers = async (req, res) => {
  try {
    const allDocs = await getDocs(usersCollection);
    const users = allDocs.docs.map((doc) => doc.data());
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = handleGetAllUsers;
