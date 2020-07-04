var express  = require("express"),
	app      = express(),
	socket   = require("socket.io"),
	newUser  = require("./online"),
	mongoose = require("mongoose");

app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/chat2");
app.use(express.static(__dirname + "/public"));

var server = app.listen(3000, function(){
	console.log("connect");
});

io = socket(server);

app.get('/',function(req,res){
	res.render("index");
});


io.on('connection', function(socket){
	//console.log("connected " + socket);



	socket.on('get-info',function(data){
		newUser.findOne({s_id: socket.id},function(err,findUser){
			if(err){
				console.log(err);
			}else{
				if(findUser){
					socket.emit('get-info', findUser);
				}else{
					// error msg
				}
			}
		});
	});

	socket.on('online', function(msg){

		newUser.create({name: msg.username.toUpperCase(),s_id: socket.id},function(err,success){
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


	socket.on('private-message', function(msg){
		newUser.findOne({name:msg.receiver},function(err,findUser){
			if(err){
				console.log(err);
			}else{
				if(findUser){
					socket.broadcast.to(findUser.s_id).emit('private-message', msg);
					socket.emit('private-message', msg);
				}else{
					// error msg
				}
			}
		});
		
	});

	socket.on('typing-message-all', function(data){
		socket.broadcast.emit('typing-message-all',data);
	});


	socket.on('typing-message-one', function(msg){
		newUser.findOne({name:msg.receiver},function(err,findUser){
			if(err){
				console.log(err);
			}else{
				if(findUser){
					socket.broadcast.to(findUser.s_id).emit('typing-message-one', msg);
				}else{
					// error msg
				}
			}
		});
	
	});

	socket.on('online-list',function(data){
		newUser.find({},function(err,allUser){
			if(err){
				console.log(err);
			}else{
				io.sockets.emit('online-list',allUser);
			}
		});

	});

	socket.on('disconnect', function(){
		var data = {s_id: socket.id};
		newUser.remove(data,function(err,success){
			if(err){
				console.log(err);
			}else{
				// console.log("deleted");
			}
		});
    	//console.log('user disconnected' + socket.id);
  	});
});


