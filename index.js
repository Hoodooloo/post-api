const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongoose')

// import the model 
const Post = require('./src/models/post')

// Define application
const app = express()

const db = mongo.connect('mongodb://localhost:27017/post-api')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// CRUD OPERATIONS ON POST

// create post

app.post('/create', function(req, res) {
   
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;

    var post = new Post();
    post.title = title;
    post.author = author;
    post.content = content;

    //  Save Post
    post.save(function(error, savedPost) {
        if(error){
            res.status(500).send({error:"Unable to save Post"})
        }else {
            res.status(200).send(savedPost);
        }
    });
});

// Get list of Post

app.get("/", function(req, res) {
    Post.find({}, function(error,posts) {
        if(error) {
            res.status(422).send({ error: "Unable to fetch posts"});
        } else {
            res.status(200).send(posts)
        }
    });
});

// Get a particular Post
app.get('/:id', function(req, res) {
    Post.findById(req.params.id, res.body ,function(error,post) {
        if(error) {
            res.send({error: "Unable to fetch a post"})
        } else {
            res.send(post)
        }
    });
});

// Update post
app.patch('/:id/update', function(req, res) {
    Post.findByIdAndUpdate(req.params.id, res.body, (error) => {
        if(error) {
            return res.status(500).send({error: "Unable to update"})
        }
        res.send({success: "Updation Successful"})
    });
});

app.delete('/:id', function(req, res) {
    Post.findByIdAndDelete(req.params.id, req.body, function(error, post) {
        if(error) {
            return res.status(500).send({ error: "Problem with updating."})
        }
        res.send(post);
    });
});

app.listen(3002, function(){
    console.log("Api Server Started at port 3002...")
});