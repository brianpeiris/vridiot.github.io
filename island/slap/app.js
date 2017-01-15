var io = require('socket.io')();
var position_x = 0;
var position_y = 0;
var position_z = 0;
console.log("Running!");
io.on('connection', function(socket) {  
	console.log("New Connection");
    socket.emit('position', { pos: {x: position_x, y: position_y, z: position_z} });

    socket.on('update_position', function(data) {
    	if(data && data.position){
    		position_x = data.position.x;
    		position_y = data.position.y;
    		position_z = data.position.z;
    		console.log("Receiving Coordinate");
    		console.log(data.position);
    		io.emit('position', { pos: {x: position_x, y: position_y, z: position_z} });
    	}
    });

});
io.listen(25543);