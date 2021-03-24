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
    let newChat = request.body;
    console.log("Name:" + request.body.Name);
    console.log("Members 1: " + request.body.Members[0]);
    console.log("Members type: " + typeof(request.body.Members));
    var arrayMembers = request.body.Members;
    console.log(arrayMembers);
    Chat.find({ Members: [ request.body.Members[0], request.body.Members[1] ]}, (error, result) =>{
        console.log("Shared members: " + result);
        console.log("Members: " + newChat.Members);
        if(JSON.stringify(result) != "[]"){
            response.send( {"id": result["ID"]});
        }
        else{
            let chat = new Chat({
                Name: newChat.Name,
                Members: newChat.Members
            });
            chat.save((error) => {
                if (error){
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

module.exports = router;