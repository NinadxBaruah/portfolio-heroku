const { usersCollection } =  require("../db/firestore");
const { v4: uuidv4 } = require("uuid");
const { doc, setDoc } = require("firebase/firestore");

const handleUserSubmit = async (req, res) => {
  try {
    const { name, email, age, weight, height, healthGoals } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).send({ error: "Name and email are required" });
    }

    const id = uuidv4();
    const createdAt = new Date();

    // Save data to Firestore
    await setDoc(doc(usersCollection, id), {
      id,
      name,
      email,
      age: Number(age), 
      weight: Number(weight),
      height: Number(height),
      healthGoals,
      createdAt,
    });

    res.status(201).send({ message: "User created", id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = handleUserSubmit;
