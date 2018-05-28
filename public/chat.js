
$(function(){

	var socket = io();
	$("#send_user").click(function(){
		socket.emit('online', {
			username: $("#user").val()
		});
		$("#one").css("display", "none");
		$("#two").css("display", "block");
	});

	$("#send_msg").click(function() {

		if($("#message").val()!= ""){
			socket.emit('chat-message', {
				message: $("#message").val(),
				username: $("#user").val()
			});
			$("#message").val('');
			$("#user").prop('disabled', true);

			return false;	
		}
		
	});

	$("#message").keypress(function(){
		socket.emit('typing-message', "typing.....");
	});

	window.setInterval(function(){
  		socket.emit('online-list', "xxx");
	}, 5000);


	//Listen for events

	socket.on('chat-message',function(msg){
		$("#typing").html('');		
		$("#output").append("<p>" + msg.message + "</p>");
	});

	socket.on('typing-message', function(msg){

		$("#typing").text(msg);
	});

	socket.on('online-list',function(data){
		$("#list").html('');
		data.forEach(function(user){
			//console.log(user.name);
			$("#list").append("<p>" +user.name + "</p>");
		});
		
	});


});

