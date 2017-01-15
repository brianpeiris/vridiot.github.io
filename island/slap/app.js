var io = require('socket.io')();
var position_x = 0;
var position_y = 0;
var position_z = 0;
console.log("Running!");
io.on('connection', function(socket) {  
console.log("New Connection!");
    var send = {x: position_x, y: position_y, z: position_z};
    socket.emit('position', send);

    socket.on('update_position', function(data) {
    	if(data && data.position){
    		position_x = data.position.x;
    		position_y = data.position.y;
    		position_z = data.position.z;
    		var send = {x: position_x, y: position_y, z: position_z};
    		io.emit('position', send);
    	}
    });

});
io.listen(25543);