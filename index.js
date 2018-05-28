var express  = require("express"),
	app      = express(),
	socket   = require("socket.io"),
	bodyParser = require("body-parser"),
	newUser  = require("./online"),
	mongoose = require("mongoose");

app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/chat");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

var server = app.listen(3000, function(){
	console.log("connect");
});

io = socket(server);

app.get('/',function(req,res){
	res.render("index");
});


io.on('connection', function(socket){
	console.log("connected " + socket.id);


	socket.on('online', function(msg){
		newUser.create({name: msg.username,s_id: socket.id},function(err,success){
			if(err){
				console.log(err);
			}else{
				console.log("done");
			}
		});
	});
		

	socket.on('chat-message', function(msg){
		io.emit('chat-message',msg);
	});


	socket.on('typing-message', function(msg){
		socket.broadcast.emit('typing-message',msg);
	});

	socket.on('online-list',function(data){
		newUser.find({},function(err,allUser){
			if(err){
				console.log(err);
			}else{
				 //allUser.forEach(function(user){
				 	//console.log(user.name);
				 	io.sockets.emit('online-list',allUser);
				 //});
			}
		});

	});

	socket.on('disconnect', function(){
		var data = {s_id: socket.id};
		newUser.remove(data,function(err,success){
			if(err){
				console.log(err);
			}else{
				console.log("deleted");
			}
		});
    	console.log('user disconnected' + socket.id);
  	});
});


