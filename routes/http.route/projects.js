

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');


const handleProjectTicTacToe = require("../../controllers/handleProjectTicTacToe");
const handleOfflineGameBoard = require("../../controllers/handleOfflineGameBoard");
const multiplayerRoute = require("../http.route/multiplayerRoute");
const chatApp = require("./api");
const videoChat = require("./videoChat")
const assignment1 = require("./assignment1");

// Tic-tac-toe routes
router.get('/tic-tac-toe', handleProjectTicTacToe);
router.get('/tic-tac-toe/offlineGameBoard', handleOfflineGameBoard);
router.use('/tic-tac-toe/multiplayer', multiplayerRoute);


router.get('/intern/1',(req , res) =>{
  res.render('internProject')
})

router.get('/intern/2', (req, res) => {
  // Use path to the public/logs directory
  const logDir = path.join(process.cwd(), 'public', 'logs');
  const logFilePath = path.join(logDir, 'access.log');

  // Ensure the logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // More robust IP extraction
  const ip = req.headers['x-forwarded-for'] || 
             req.socket.remoteAddress || 
             req.connection.remoteAddress;

  // Extract user information
  const logData = {
    timestamp: new Date().toISOString(),
    ip: ip,
    userAgent: req.get('User-Agent') || 'Unknown',
    url: req.originalUrl
  };

  // Format log as a string
  const logString = `${logData.timestamp} - IP: ${logData.ip}, User-Agent: ${logData.userAgent}, URL: ${logData.url}\n`;

  // Append log to file
  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      // console.log('Log entry saved:', logString.trim());
    }
  });

  // Render the page
  res.render('assignment1');
});

router.use("/intern/2/api/v1" ,assignment1);
// Screen Mirror Routes

router.use('/video-chat',videoChat);

// Chat app API routes
router.use('/chat-app/api', chatApp);

// Chat app client routes - This should be the last route for chat-app
router.get('/chat-app/*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist/index.html'), {  //../../client/
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } else {
    res.redirect("http://localhost:5173");
  }
});
// React intern App 
router.get('/react-intern/*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'react-intern-build/index.html'), {  //../../client/
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } else {
    res.redirect("http://localhost:5173");
  }
});

module.exports = router;