let express = require('express');
let router = express.Router();
let User = require('../models/User.js');

router.patch('/:username', (request, response, next) => {
    response.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    User
        .findOne({"username": request.body["blockedUser"]}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }
            else if (result){
                if(result["blockedBy"].indexOf(request.params.username) == -1){
                    result["blockedBy"].push(request.params.username);
                }
                result.save((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                });
            } else {
                response.status(404).send({"username": request.params.username, "error":  "Not Found"});
            }
        });
    User
        .findOne({"username": request.params.username}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }
            else if (result){
                if(result["blocking"].indexOf(request.body["blockedUser"]) == -1){
                    result["blocking"].push(request.body["blockedUser"]);

                }
                result.save((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.status(200).send(request.body["blockedUser"]);
                });
            } else {
                response.status(404).send({"username": request.params.username, "error":  "Not Found"});
            }

        });
});

module.exports = router;