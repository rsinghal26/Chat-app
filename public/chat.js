
$(function(){

	var socket = io();
	var username = "";

	
	//send username to server-------------------
	$("#send_user").click(function(){
		if($("#user").val() != ""){
			socket.emit('online', {
				username: $("#user").val()
			});
			$("#one").css("display", "none");
			$("#two").css("visibility", "visible");	
			$("#private").css("display", "block")
			socket.emit('get-info',"send name");
		}else{
			alert("Enter username");
		}
		
	});
//------------------------

//send message to server-------------------
	$("#send_msg").click(function() {
		if($("#message").val()!= "" && $("#receiver").val() == ""){
			socket.emit('chat-message', {
				message: $("#message").val(),
				username: $("#user").val()
			});
			$("#message").val('');
			$("#user").prop('disabled', true);

			return false;	
		}
		
	});

//send private message to server---------------------------	

	$("#send_msg").click(function(){
		if($("#message").val()!= "" && $("#receiver").val() != ""){
			
			var string = $("#receiver").val().toUpperCase();
			//alert("you are in private " + string);
			socket.emit('private-message',{
				message: $("#message").val(),
				username: $("#user").val(),
				receiver: string
			});
			$("#message").val('');
			return false;	
		}
	});
//----------------------------------------




//send typing event to srver-----------

	$("#message").keypress(function(){
		if($("#receiver").val() == ""){
			socket.emit('typing-message-all',{
				name: username
			});	
		}else{
			socket.emit('typing-message-one', {
				name: username,
				receiver: $("#receiver").val().toUpperCase()
			});
		}
		
	});

//------------------

	window.setInterval(function(){
  		socket.emit('online-list', "xxx");
	}, 5000);




//Listen for events------------------------------------

	
	socket.on('get-info',function(data){
		username = data.name;
	});

	socket.on('chat-message',function(msg){
		$("#typing").html('');
		if(msg.username.toUpperCase() == username.toUpperCase()){
			// console.log("SDfsdfsdf");
			$("#output").append("<p id='p1'>" + msg.message + "</p>");
		}else{
			$("#output").append("<p id='p2'> <strong style='color:brown'>" + msg.username + ":</strong> " + msg.message + "</p>");
		}
		
	});

	socket.on('typing-message-all', function(data){

		$("#typing").text(data.name + " is typing.......");
	});


	socket.on('typing-message-one', function(data){

		$("#typing").text(data.name +" is typing.......");
	});


	socket.on('online-list',function(data){
		$("#list").html('');
		data.forEach(function(user){
			if(user.name == username){
				$("#list").append("<tr><td>*</td><td>" +user.name + " (Me)</td> <td><span  class='dot'></span></td></tr>");
			}else{
				$("#list").append("<tr><td>*</td><td>" +user.name + "</td> <td><span  class='dot'></span></td></tr>");
			}
			
		});
	});


	socket.on('private-message',function(msg){
		$("#typing").html('');
		// console.log(msg);		
		if(msg.username.toUpperCase() == username.toUpperCase()){
						
			$("#output").append("<p id='p1'>" + msg.message + "</p>");
		}else{
			
			$("#output").append("<p id='p2'> <strong style='color:brown'>" + msg.username + ":</strong> " + msg.message + "</p>");

		}
	});


});

