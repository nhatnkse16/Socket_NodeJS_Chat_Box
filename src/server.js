/** 
 * 
 * CẤU HÌNH EXPRESS 
 * 
 */


/** Khai báo dotevn */
require('dotenv').config();

/** Khai báo path join đến file ejs */
const path = require('path');


/** Khai báo express */
const express = require('express');
const app = express();
// app.use(express.static('./public'));
app.use(express.static(__dirname + '/public'));

/** Khai báo path đến file ejs */
app.set('views', path.join('./src', 'views'));
app.set('view engine', 'ejs');


/** Khai báo server */
const port = process.env.PORT || 8888;                  //port
const hostname = process.env.HOST_NAME;
// app.listen(port, hostname, () => {
//     console.log(`App listening on port ${port}`)
// });

const server = require('http').Server(app);
server.listen(port);

/** Tạo hàm getter cơ bản */
app.get('/', function (req, res) {
    res.render('chat');
});



/**
 *
 * CẤU HÌNH SOCKET IO
 *
 */


const io = require("socket.io")(server);


// /** Hàm lắng nghe sự kiện kết nối */
// io.on('connection', function (socket) {                   // Lắng nghe có người kết nối => on
//     console.log("Có người kết nối --> " + socket.id);

//     /** Hàm Lắng nghe sự kiện ngắt kết nối */
//     socket.on('disconnect', function () {
//         console.log("Đã ngắt kết nối  --> " + socket.id);
//         console.log('\n*****************************');
//     })

//     /** Lấy ra data người dùng gửi lên Server */
//     socket.on('Client_Send_Data', function (data) {
//         console.log('Client ' + socket.id + ' send data: ' + data);

//         // io.sockets.emit('Server_Send_Data', data);               // Trong hàm này, Server sẽ phát tín hiệu (Value) về cho toàn bộ client (Kể cả người gửi)

//         // socket.emit('Server_Send_Data', data);                   // Trong hàm này, Server chỉ trả tín hiệu (Value) về cho người gửi nó lên

//         // socket.broadcast.emit('Server_Send_Data', data);           // Trong hàm này, Server sẽ phát tín hiệu (Value) về cho toàn bộ client khác (Trừ người gửi)

//         /** Để gửi riêng cho từng người ==> Gửi đến Client theo Socket_ID người nhận (Tìm cách giữ lại Socket_ID) */
//         // io.to("socket.id").emit();

//     });
// });



/**
 * 
 *  CHAT DEMO SOCKET IO
 * 
 *  */

var userList = [];      // Khai báo mảng chứa danh sách User login vào

io.on('connection', function (socket) {
    console.log("Có người kết nối --> " + socket.id);

    /** Hàm đăng nhập vào Box Chat */
    socket.on('Client-Send-Chat-Name', function (data) {
        console.log('Client ' + socket.id + ' Input Username: ' + data);

        if (userList.indexOf(data) >= 0) {              // Check xem trong mảng đã tồn tại User Name tương tự chưa
            // Fail
            socket.emit('Server_Send_Fail_Login');                   // Trong hàm này, Server chỉ trả tín hiệu (Value) về cho người gửi nó lên

        } else {
            // Success
            userList.push(data);                        // Thêm User Name vào mảng
            socket.Username = data;                     // Tự tạo biến Username

            socket.emit('Server_Send_Success_Login', data);
            io.sockets.emit('Server_Send_List_User', userList);

            console.log('UserName login: ', data);
            console.log('Danh sach online: ', userList);
        }

    });

    /** Hàm Chat */
    socket.on('Client-Send-Message', function (message) {
        console.log('Client ' + socket.Username + ' send Message: ' + message);
        io.sockets.emit('Server-Respone-Message', { uName: socket.Username, mess: message });
    });

    /** Hàm xoá User click nút logout */
    socket.on('Client-Click-Logout', function () {
        userList.splice(
            userList.indexOf(socket.Username), 1
        );

        socket.broadcast.emit('Server_Send_List_User', userList);           // Trả về mảng mới chứa danh sách User (sau khi đã xoá -> Nên có thể dùng lại mảng trên)          // Trong hàm này, Server sẽ phát tín hiệu (Value) về cho toàn bộ client khác (Trừ người gửi)
    });

    /** Hàm bắt sự kiện khi User Gõ chữ */
    socket.on('Client-Typing-Now', function () {
        var typingUser = socket.Username;
        console.log(socket.Username + ' đang gõ chữ .....');
        socket.broadcast.emit('Server_Respone_Typing_User', typingUser);

    });

    socket.on('Client-Stopping-Typing', function () {
        var topTypingUser = socket.Username;
        console.log(socket.Username + ' đã dừng gõ chữ');
        socket.broadcast.emit('Server_Respone_User_Stop_Typing', topTypingUser);

    });

});
