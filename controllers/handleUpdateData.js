const { usersCollection } =  require("../db/firestore");
const { doc, updateDoc } = require("firebase/firestore");


const handleUpdateData = async (req, res) =>{
    const {name, email, age, weight, height, healthGoals} = req.body;
    const id = req.params.id;
    if(!name && !email && !age && !weight && !height && !healthGoals){
        return res.status(400).json({message: "Please fill in all fields."});
    }

    // preparing the data to update, only assiging the data that are provided
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (age) updates.age = age;
    if (weight) updates.weight = weight;
    if (height) updates.height = height;
    if (healthGoals) updates.healthGoals = healthGoals;

    // adding latest Date and Time 

    updates.createdAt = new Date();
    try {
        // Reference to the user document
        const userRef = doc(usersCollection, id);
    
        // Update the document with the provided fields
        await updateDoc(userRef, updates);
    
        res.status(200).json({ message: "User updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the user" });
      }

}


module.exports = handleUpdateData;