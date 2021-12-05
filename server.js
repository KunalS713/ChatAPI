
var express = require("express")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")

var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)

var conString = "mongodb://localhost:8000/chat_app";
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise;

const chatSchema= new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
        default: ""
    },

    isSent: {
        type: Boolean,
        required: true
    },

}, {
    timestamps: true,
 });

 const Chats=mongoose.model('Chats',chatSchema);
// module.exports=User;
// var Chats = mongoose.model("Chats", {
//     name: String,
//     chat: String
// })


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    chatlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],

}, {
    timestamps: true,
});


const User = mongoose.model('User', userSchema);

mongoose.connect(conString,  (err) => {
    console.log("Database connection", err)
})

app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        //Emit the event
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})

io.on("connection", (socket) => {
    console.log("Socket is connected...")
})

var server = http.listen(8000, () => {
    console.log("Server is listening on Port ", server.address().port)
});

module.exports=Chats;
module.exports = User;