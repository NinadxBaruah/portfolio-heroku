const express = require("express");
const router = express.Router();

const handleProjectTicTacToe = require("../../controllers/handleProjectTicTacToe");
const handleOfflineGameBoard = require("../../controllers/handleOfflineGameBoard")
const multiplayerRoute = require("../http.route/multiplayerRoute")


router.get('/tic-tac-toe',handleProjectTicTacToe);
router.get('/tic-tac-toe/offlineGameBoard',handleOfflineGameBoard)
router.use('/tic-tac-toe/multiplayer',multiplayerRoute);

// router.get('/offlineGameBoard',handleOfflineGameBoard);
module.exports = router