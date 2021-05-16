// var express = require('express');
// var router = express.Router();
//
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
// module.exports = router;


// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let User = require('../models/User.js');
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './profilepics/');
    },
    filename: function(req, file, callback) {
        file.originalname = Date.now().toString() + file.originalname.replace("[^\\w\\s-.", "");
        callback(null, file.originalname);
        console.log(file);
    }
});
let filter = function(req, file, callback){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        callback(null, true);
    } else {
        callback(null, false);
    }
}
let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filter
});

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/',(request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //console.log(request.file);
    let obj = JSON.parse(JSON.stringify(request.body));
    let newUser = obj;
    console.log(newUser);

    if (!newUser.firstname || !newUser.lastname || !newUser.username || !newUser.password || !newUser.confirmpassword) {
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    } else if (newUser.password != newUser.confirmpassword){
        HandleError(response, 'Passwords not matching', 'Passwords do not match', 500);
    } else {
        let user = new User({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            username: newUser.username,
            password: newUser.password,
            confirmpassword: newUser.confirmpassword,
            bio: newUser.bio,
            langExp: newUser.langExp,
            langLearn: newUser.langLearn,
            profileImage: newUser.profileImage
        });
        user.save((error) => {
            if (error) {
                response.send({"error": error});
            } else {
                response.send({"id": user._id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // firstname if found produces [this.response] instead of just this.response
    let firstname = request.query['firstname'];
    //let lastname = request.query['lastname'];
    if (firstname){
        User
            // need to adjust for case sensitivity
            .find({"firstname": firstname})
            .exec( (error, User) => {
                if (error){
                    response.send({"error": error});
                } else {
                    response.send(User);
                }
            });
    } else {
        User
            .find()
            .exec( (error, User) => {
                if (error){
                    response.send({"error": error});
                } else {
                    response.send(User);
                }
            });
    }
} );

router.get('/:username', (request, response, next) =>{
    User
        .find({"username": request.params.username}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result) {
                response.send(result);
            } else {
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});
router.patch('/:username', upload.single('profileImage'), (request, response, next) =>{
    User
        .findOne({"username": request.params.username}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            } else if (result){
                if (request.body.username) {
                    delete request.body.username;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                if(request.file != undefined){
                    result["profileImage"] = Date.now().toString().substring(13, 26) + request.file.originalname.replace("[^\\w\\s-.", "");
                }


                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            } else {
                response.status(404).send({"username": request.params.username, "error":  "Not Found"});
            }

        });
});
router.delete('/:username', (request, response, next) =>{
    User
        .findOne({"username": request.params.username}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            } else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deleted_username": request.params.username});
                });
            } else {
                response.status(404).send({"ISBN": request.params.username, "error":  "Not Found"});
            }
        });
});

module.exports = router;