let express = require('express');
let router = express.Router();
// For the Data Model
let PostSchema = require('../models/Post.js');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.get('/', (req, res) => {
    PostSchema.find({},(err, posts)=> {
        // res.sendFile('posts.html', {root: 'views'});
        res.send(posts);
    })
})

router.post('/', (req, res) => {
    let newPost = JSON.parse(JSON.stringify(req.body));
    let post = new PostSchema({
        Name: newPost.Name,
        Body: newPost.Body,
    });
    post.save((error) => {
        if (error){
            response.send({"error": error});
        }else{
            PostSchema.find({},(err, posts)=> {
                // res.sendFile('posts.html', {root: 'views'});
                res.send(posts);
            })
        }
    });
    // let post = new Post(req.body);
    // post.save((err) =>{
    //     if(err)
    //         sendStatus(500);
    //     res.sendStatus(200);
    // })
})

module.exports = router;