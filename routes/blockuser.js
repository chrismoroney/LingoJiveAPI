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
                result["blockedBy"] = request.params.username;
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
                result["blocking"] = request.body["blockedUser"];
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