$(document).ready(function(){
    var socket = io();

    var room= $('#groupName').val(); // sini dpt drpde view file
    var sender = $('#sender').val();

    socket.on('connect', function(){
        console.log('yea user conet');

        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params,function (){
            console.log('user has join this channel')
        });
    });

    socket.on('usersList', function(users){    //sini amik drpde socket/groupchat aka server
        var ol =$('<ol></ol>'); //ol stands for ordered
        
        for(var i = 0; i < users.length; i++){
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        $(document).on('click', '#val', function(){
            $('#name').text('@'+$(this).text());
            $('#recievername').val($(this).text());
            $('#nameLink').attr("href", "/profile/"+$(this).text());
        });

        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    socket.on('newMessage', function(data){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text:data.text,
            sender: data.from
        });

        $('#message').append(message);
        
    });

    $('#message-form').on('submit', function(event){
        event.preventDefault();
        
        var msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room: room,
            from: sender
        }, function(){
            $('#msg').val('');
        
        });
    });
});