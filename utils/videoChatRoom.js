const videoChatRoom = new Map()



function setvideoChatRoom(id, client) {
    const stringId = id.toString();
    videoChatRoom.set(stringId, client);
    return videoChatRoom.get(stringId); 
}

function getvideoChatRoom(id) {
    const stringId = id.toString();
    const client = videoChatRoom.get(stringId);
    return client;
}

function hasVideoChatRoom(id) {
    const stringId = id.toString();
    return videoChatRoom.has(stringId);
}



module.exports = { setvideoChatRoom, getvideoChatRoom , hasVideoChatRoom ,videoChatRoom};