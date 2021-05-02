let express = require('express');
let router = express.Router();

let Chat = require('../models/Chat.js');

router.get('/', (request, response, next) =>{
    Chat.find( (error, result) =>{
            console.log(result);
            if (error) {
                response.status(500).send(error);
            }
            if (result && JSON.stringify(result) != "[]"){
                console.log(JSON.stringify(result));
                response.send(result);
            }else{
                response.status(404).send({"user": request.params.user, "error":  "Not Found"});
            }

        }

    );
});

router.get('/:user', (request, response, next) =>{
    if(request.params.user){
        Chat.find({ Members: { $all: [request.params.user] } }, (error, result) =>{
                console.log(result);
                if (error) {
                    response.status(500).send(error);
                }
                if (result && JSON.stringify(result) != "[]"){
                    console.log(JSON.stringify(result));
                    response.send(result);
                }else{
                    response.status(404).send({"user": request.params.user, "error":  "Not Found"});
                }

            }

        );
    }
});


router.post('/', (request, response, next) => {
    console.log("post entered");
    var members = [];
    members.push(request.body.Member1);
    members.push(request.body.Member2);
    var unreadby = "";
    // let newChat = request.body;
    let newChat = {
        Name: request.body.Name,
        Members: members,
        UnreadBy: unreadby
    }

    // console.log("Name:" + request.body.Name);
    // console.log("Members 1: " + request.body.Members[0]);
    // console.log("Members type: " + typeof(request.body.Members));

    console.log("Members type: " + typeof(newChat.Members));


    // var arrayMembers = request.body.Members;
    // console.log(arrayMembers);
    Chat.find({ Members: newChat.Members /* [ request.body.Members[0], request.body.Members[1] ] */}, (error, result) =>{
        console.log("Shared members: " + result);
        console.log("Members: " + newChat.Members);
        if(JSON.stringify(result) != "[]"){
            console.log("copy found");
            response.send( {"id": result["ID"]});
        }
        else{
            console.log("new chat being added");
            let chat = new Chat({
                Name: newChat.Name,
                Members: newChat.Members,
                UnreadBy: newChat.UnreadBy
            });
            chat.save((error) => {
                console.log("chat being saved");
                if (error){
                    console.log("error saving");
                    response.send({"error": error});
                }else{
                    response.send({"id": chat.id});
                }
            });
        }
    })
});

//probably won't be used in the real program; just wanted to delete repeat chats
router.delete('/:user', (request, response, next) =>{
    if(request.params.user){
        Chat.findOne({ Members: { $all: [request.params.user] } }, (error, result) =>{
                console.log(result);
                if (error) {
                    response.status(500).send(error);
                }
                if (result && JSON.stringify(result) != "[]"){
                    result.remove((error) => {
                        if (error) {
                            console.log("error remove");
                            response.status(500).send(error);
                        }
                        response.send({"deletedISBN": request.params.isbn});
                    });
                }else{
                    response.status(404).send({"user": request.params.user, "error":  "Not Found"});
                }

            }

        );
    }
});

router.patch('/', (request, response, next) => {
    console.log("??????");
    Chat.
        findOne({"_id": request.body.ChatID}, (error, result) =>{
            if(error){
                console.log("error");
                response.status(500).send(error);
            }
            else if(result){
                console.log("result found");
                console.log(request.body.Recipient);
                result["UnreadBy"] = request.body.Recipient;
                result.save((error)=>{
                    if(error){
                        console.log("can't save chat patch");
                        response.status(500).send(error);
                    }
                    console.log("successfully made patch");
                    response.status(200).send(request.body.Recipient)
                })
            }else{
                response.status(404).send("Chat not found");
                console.log("no result found")
            }
    });
    // User
    //     .findOne({"username": request.params.username}, (error, result)=>{
    //         if (error) {
    //             response.status(500).send(error);
    //         }
    //         else if (result){
    //             result["blocking"] = request.body["blockedUser"];
    //             result.save((error)=>{
    //                 if (error){
    //                     response.status(500).send(error);
    //                 }
    //                 response.status(200).send(request.body["blockedUser"]);
    //             });
    //         } else {
    //             response.status(404).send({"username": request.params.username, "error":  "Not Found"});
    //         }
    //
    //     });
});

module.exports = router;
