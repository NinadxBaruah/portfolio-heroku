const { deleteDoc, doc, getDoc } = require("firebase/firestore");
const { usersCollection } = require("../db/firestore");

const handleDeleteUser  = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "User  ID is required" });
    }
    try {
        const userRef = doc(usersCollection, id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return res.status(404).json({ message: "User  not found" });
        }

        await deleteDoc(userRef);
        return res.status(200).json({ message: "User  deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
}

module.exports = handleDeleteUser ;