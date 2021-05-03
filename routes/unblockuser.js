let express = require('express');
let router = express.Router();


let User = require('../models/User.js');

router.patch('/:username', (request, response, next) => {

    User
        .findOne({"username": request.body["blockedUser"]}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }
            else if (result){
                for(let i = 0; i < result["blockedBy"].length; i++){
                    if(result["blockedBy"][i] === request.params.username){
                        result["blockedBy"].splice(i,1);
                    }
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
                for(let i = 0; i < result["blocking"].length; i++){
                    if(result["blocking"][i] === request.body["blockedUser"]){
                        result["blocking"].splice(i,1);
                    }
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