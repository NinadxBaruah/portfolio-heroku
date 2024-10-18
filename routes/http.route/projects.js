const express = require("express");
const router = express.Router();

const handleProjectTicTacToe = require("../../controllers/handleProjectTicTacToe");
const handleOfflineGameBoard = require("../../controllers/handleOfflineGameBoard")
const multiplayerRoute = require("../http.route/multiplayerRoute")
const chatAppRouter = require("./chatApp")
const chatApp = require("./api")



router.get('/tic-tac-toe',handleProjectTicTacToe);
router.get('/tic-tac-toe/offlineGameBoard',handleOfflineGameBoard)
router.use('/tic-tac-toe/multiplayer',multiplayerRoute);
router.use('/chat-app', chatAppRouter)
// router.get('/offlineGameBoard',handleOfflineGameBoard);
module.exports = router