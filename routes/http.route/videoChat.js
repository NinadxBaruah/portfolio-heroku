const router = require("express").Router()




router.get('/', (req , res) =>{
    res.render('video-chat')
})


module.exports = router;