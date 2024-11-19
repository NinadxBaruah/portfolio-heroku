const router = require("express").Router();
const handleUserSubmit = require("../../controllers/handleUserSubmit")
const handleGetAllUsers = require("../../controllers/handleGetAllUsers");
const handleGetUser = require("../../controllers/handleGetUser");
const handleUpdateData = require("../../controllers/handleUpdateData");
const handleDeleteUser = require("../../controllers/handleDeleteUser");



// Post end point
router.post("/users" , handleUserSubmit);

// End point to get all users
router.get("/users",handleGetAllUsers);

// Get user data with Id
router.get("/users/:id", handleGetUser);

// Put End point to update data
router.put("/users/:id", handleUpdateData);

// End Point to DELETE user
router.delete("/users/:id" , handleDeleteUser);

module.exports = router;




