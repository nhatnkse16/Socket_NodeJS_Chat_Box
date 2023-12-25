var socket = io('http://localhost:8081/')

/**
 * 
 *  Server gửi data về cho Client
 * 
 */

socket.on('Server_Send_Fail_Login', function () {
    alert('Tên này đã được sử dụng !!!\nVui lòng Nhập lại');
    $('#userName').val('')
});

socket.on('Server_Send_Success_Login', function (data) {
    // alert('Bạn đã đăng ký thành công');
    $('#enterName').hide(2000);         // Ẩn sau 2s
    $('#chatForm').show(2000);          // Hiện sau 2s
    $('#welcome-Users').html(data);
    console.log('username: ', data)
});

socket.on('Server_Send_List_User', function (userList) {
    // Clear existing content
    $('#online-Users').html('');

    /** Dùng vòng lặp For/ForEach để duyệt phần tử trong mảng */

    // for (var i = 0; i < userList.length; i++) {
    //     $('#online-Users').append('<li>' + userList[i] + '</li> <hr>');
    // }

    userList.forEach(function (i) {
        $('#online-Users').append('<li>' + i + '</li> <hr>');
        console.log('User: ', i);
    });

    console.log('Online Users List: ', userList);
});

socket.on('Server-Respone-Message', function (message) {
    console.log(message.uName + ' send message: ' + message.mess)
    var displayMessage = '<li class="agent clearfix"> ' +
        '<span class="chat-img left clearfix mx-2"> ' +
        '<img src="http://placehold.it/50/55C1E7/fff&text=U" alt="Agent" class="img-circle" /> ' +
        '</span> ' +
        '<div class="chat-body clearfix"> ' +
        '<div class="header clearfix"> ' +
        '<strong class="primary-font">' +
        message.uName +
        '</strong> ' +
        '<small class="right text-muted"> <span class="glyphicon glyphicon-time"></span> ' +
        '</small> ' +
        '</div> ' +
        '<p> ' + message.mess + '</p> ' +
        '</div> ' +
        '</li> ';

    // Append the new <li> element to the message list
    $('#message-list').append(displayMessage);
    console.log(displayMessage);
});

socket.on('Server_Respone_Typing_User', function (typingUser) {
    console.log('typingUser: ' + typingUser + ': ...');
    var typingMessage = '<li class="agent clearfix">' +
        '<span class="chat-img left clearfix mx-2">' +
        '<img src="http://placehold.it/50/55C1E7/fff&text=U" alt="Agent" class="img-circle"/>' +
        '</span>' +
        '<div class="chat-body clearfix">' +
        '<div class="header clearfix">' +
        '<strong class="primary-font">' +
        typingUser +
        '</strong>' +
        '<small class="right text-muted">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        '</small>' +
        '</div> <br>' +
        '<div class="chat-container">' +
        '<div class="chat-bubble">' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</li> ';

    $('#message-typing').append(typingMessage);
});

socket.on('Server_Respone_User_Stop_Typing', function (stopTypingUser) {
    console.log('User: ' + stopTypingUser + ' Stop Typing');
    $('#message-typing').html('');
});


/**
 * 
 *  Client gửi data lên cho Server
 * 
 */

$(document).ready(function () {
    $('#enterName').show();
    $('#chatForm').hide();

    $('#register').click(function () {
        socket.emit('Client-Send-Chat-Name', $('#userName').val());
    });

    $('#btn-logout').click(function () {
        socket.emit('Client-Click-Logout');
        $('#enterName').show(1000);
        $('#chatForm').hide(1000);
    });

    $('#send-chat').click(function () {
        socket.emit('Client-Send-Message', $('#input-message').val());
        $('#input-message').val('');
    });


    /** Hàm bắt sự kiện khi User Gõ chữ */
    $('#input-message').focusin(function () {
        socket.emit('Client-Typing-Now');
    })

    $('#input-message').focusout(function () {
        socket.emit('Client-Stopping-Typing');
    })
});
