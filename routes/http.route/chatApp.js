const express = require("express")
const router = express.Router();
const chatApp = require("./api")



router.use('/api' , chatApp)
router.get("/*", (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    } else {
      // If in development, you might want to set this up to serve your React app differently.
      // For example, you can run the React app separately in development mode.
      res.redirect("http://localhost:5173"); // Adjust according to your setup.
    }
  });


module.exports = router