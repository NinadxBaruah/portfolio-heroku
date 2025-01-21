const router = require("express").Router();
const emailController = require("../../controllers/intern2/routes/email")
const uploadController = require("../../controllers/intern2/routes/upload")

router.use('/email',emailController);
router.use('/upload',uploadController);

module.exports = router;