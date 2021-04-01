let express = require('express');
let router = express.Router();
// For the Data Model
let DirectMessage = require('../models/DirectMessage.js');

router.get('/:ChatID', (req, res) => {
    DirectMessage.find({"ChatID": req.params.ChatID},(err, messages)=> {
        res.send(messages);
    })
})

router.post('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let message = new DirectMessage(req.body);
    message.save((err) =>{
        if(err)
            res.sendStatus(500);
        res.sendStatus(200);
    })
})

module.exports = router;