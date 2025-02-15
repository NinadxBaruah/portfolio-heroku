const { WebSocketServer, WebSocket } = require("ws");
const {
  setGameRoom,
  getGameRoom,
  deleteRoom,
} = require("../utils/create-game-room");

const {
  setFriendsRoom,
  getFriendsRoom,
  friendsRoom,
} = require("../utils/friendsRoom");
const {
  setvideoChatRoom,
  getvideoChatRoom,
  hasVideoChatRoom,
  videoChatRoom,
} = require("../utils/videoChatRoom");

const jwt = require("jsonwebtoken");
function onSocketPreError(e) {
  console.log("Socket Pre Error", e);
}
function onSocketPostError(e) {
  console.log("Socket Post Error:", e);
}

module.exports = function configure(server) {
  const wss = new WebSocketServer({ noServer: true });
  // this will triggered when http server try to upgrade the
  //conneciton to WebSocket, we can do auth here also distroy the socket if needed

  // Set up an interval outside the connection handler to send pings to all users
  setInterval(() => {
    // Iterate over all connected users in friendsRoom and send ping messages
    for (const [userId, ws] of friendsRoom.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }

    // Iterate over all connected users in videoChatRoom and send ping messages
    for (const [userId, ws] of videoChatRoom.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }
  }, 30000); // Send ping every 30 seconds
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", onSocketPreError);
    const urlParts = req.url.split("/");
    if (urlParts[1] == "multiplayer") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", onSocketPreError);
        wss.emit("connection", ws, req);
      });
    } else if (urlParts[1] == "video-chat") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", onSocketPreError);
        wss.emit("connection", ws, req);
      });
    } else if (urlParts[1] == "send-message") {
      const authToken = req.headers["sec-websocket-protocol"];
      jwt.verify(authToken, process.env.jwt_secret, (err, user) => {
        if (err) {
          console.log("JWT verification failed:", err);
          socket.destroy();
          return;
        }

        req.user = user.userId;

        wss.handleUpgrade(req, socket, head, (ws) => {
          socket.removeListener("error", onSocketPreError);
          wss.emit("connection", ws, req);
        });
      });
    }
  });

  wss.on("connection", (ws, req) => {
    // console.log("client connected");
    ws.on("error", onSocketPostError);
    const urlParts = req.url.split("/");
    const roomId = urlParts[3];
    if (urlParts[1] == "multiplayer" && urlParts[2] == "game-board" && roomId) {
      try {
        // if(!getGameRoom(roomId)) ws.send(JSON.stringify({type:"demo"}))
        const roomDetails = getGameRoom(roomId);
        if (!roomDetails) ws.close("closed");
        if (!roomDetails.clientOne) {
          roomDetails.clientOne = ws;
          setGameRoom(roomId, roomDetails);
        } else if (!roomDetails.clientTwo) {
          roomDetails.clientTwo = ws;
          setGameRoom(roomId, roomDetails);
        }
      } catch (error) {
        console.log(error);
      }

      ws.on("message", (data) => {
        const message = data.toString();
        const parsedMessage = JSON.parse(message);
        const roomId = parsedMessage.roomId;
        const roomDetails = getGameRoom(roomId);
        if (parsedMessage.type == "closing") {
          try {
            if (roomDetails.clientOne) {
              roomDetails.clientOne.send(
                JSON.stringify({ type: "opponentLeft" })
              );
              roomDetails.clientOne.close();
            }
            if (roomDetails.clientTwo) {
              roomDetails.clientTwo.send(
                JSON.stringify({ type: "opponentLeft" })
              );
              roomDetails.clientTwo.close();
            }
            deleteRoom(roomId);
          } catch (e) {
            console.log("error from closing from message");
          }
        }
        // console.log(parsedMessage);
        const clientToSend = getGameRoom(roomId);
        if (clientToSend && clientToSend.clientOne && clientToSend.clientTwo) {
          if (clientToSend.clientOne == ws) {
            clientToSend.clientTwo.send(JSON.stringify(parsedMessage));
          } else {
            clientToSend.clientOne.send(JSON.stringify(parsedMessage));
          }
          // clientToSend.clientOne.send(JSON.stringify(parsedMessage));
          // clientToSend.clientTwo.send(JSON.stringify(parsedMessage));
        }
        // console.log(getGameRoom(roomId))
      });
      // Handle client disconnection
      ws.on("close", () => {
        const roomDetails = getGameRoom(roomId);
        if (roomDetails) {
          // Notify the other client in the room
          if (roomDetails.clientOne === ws && roomDetails.clientTwo) {
            roomDetails.clientTwo.send(
              JSON.stringify({ type: "opponentLeft" })
            );
            roomDetails.clientTwo.close();
            deleteRoom(roomId);
            return;
          } else if (roomDetails.clientTwo === ws && roomDetails.clientOne) {
            roomDetails.clientOne.send(
              JSON.stringify({ type: "opponentLeft" })
            );
            roomDetails.clientOne.close();
            deleteRoom(roomId);
            return;
          }
          // Clean up the room if both clients have disconnected
          if (!roomDetails.clientOne && !roomDetails.clientTwo) {
            deleteRoom(roomId);
          }
        }
        // console.log(getGameRoom(roomId));
      });
    } else if (urlParts[1] === "send-message") {
      const userId = req.user;
      const storedWs = setFriendsRoom(userId, ws);
      // console.log("number of connected user",friendsRoom.size)
      ws.on("message", async (data) => {
        try {
          const {
            type,
            name,
            answer,
            candidate,
            offer,
            sendTo,
            message,
            picture,
            callTo,
            user_id,
          } = JSON.parse(data.toString());
          if (type === "send") {
            const recipientWs = getFriendsRoom(sendTo);
            if (recipientWs) {
              recipientWs.send(
                JSON.stringify({
                  type: "receive",
                  from: userId,
                  name: name,
                  message: message,
                  picture: picture,
                  timestamp: new Date().toISOString(),
                })
              );
            } else {
              ws.send(
                JSON.stringify({
                  type: "error",
                  error: "Recipient not found or offline",
                  to: sendTo,
                  timestamp: new Date().toISOString(),
                })
              );
            }
          }
          if(type == "is:online") {
            const is_user_available = getFriendsRoom(sendTo);
            const senderId = getFriendsRoom(user_id);
            if(is_user_available){
              senderId.send(JSON.stringify({type:"online:status",isOnline:"online"}))
            }
            else{
              senderId.send(JSON.stringify({type:"online:status",isOnline:"offline"}))
            }
          }
          if (type == "video-call") {
            const callingClient = getFriendsRoom(callTo);
            if (callingClient) {
              callingClient.send(
                JSON.stringify({
                  type: "video-call",
                  from: user_id,
                  name: name,
                })
              );
            }
          }

          if (type == "reject") {
            const clientToSend = getFriendsRoom(sendTo);
            if (clientToSend) {
              clientToSend.send(
                JSON.stringify({ type: "reject", from: user_id })
              );
            }
          }
          if (type == "call-ended") {
            const clientToSend = getFriendsRoom(sendTo);
            if (clientToSend) {
              clientToSend.send(
                JSON.stringify({ type: "call-ended", from: user_id })
              );
            }
          }
         
          if(type == "request:offer") {
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"on:request:offer"}))
            }
          }
 
          if(type == "on:offer") {
            const clientToSend = getFriendsRoom(sendTo);
            console.log("offer recieved")
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"on:offer" , offer:offer}))
            }
          }
          if( type == "on:answer") {
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"on:answer" , answer:answer}))
              }
          }
          if(type == "on:ice") {
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"on:ice" , candidate:candidate}))
              }
          }
          if(type == "stop:sending:answer") {
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"stop:sending:answer"}))
              }
          }
          if(type == "stop:sending:offer") {
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"stop:sending:offer"}))
              }
          }
          if (type == "on:offer:reset") {
            const clientToSend = getFriendsRoom(sendTo);
            const userIDs = getFriendsRoom(user_id);
            if(userIDs) {
              userIDs.send(JSON.stringify({ type: "on:offer:reset" ,offer:offer}));
            }
            if (clientToSend) {
              clientToSend.send(JSON.stringify({ type: "on:offer:reset" ,offer:offer}));
            }
          }
          if(type == "user:typing"){
            const clientToSend = getFriendsRoom(sendTo);
            if(clientToSend) {
              clientToSend.send(JSON.stringify({type:"user:typing"}))
              }
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      // Clean up on disconnect
      ws.on("close", () => {
        // console.log("Client disconnected:", userId);
        // console.log("Removing from friendsRoom map...");
        const stringId = userId.toString();
        friendsRoom.delete(stringId);
        // console.log("Map size after removal:", friendsRoom.size);
      });
    } else if (urlParts[1] == "video-chat") {
      let user_id;
      ws.on("message", (data) => {
        try {
          const dataToString = data.toString();
          const message = JSON.parse(dataToString);
          // console.log(message)

          if (message.type == "setUser") {
            user_id = message.user_id;
            // ws.iceCandidates = [];
            // ws.SDPoffer = [];
            setvideoChatRoom(user_id, ws);
          }

          if (message.type == "call") {
            const caller_id = message.callerId;
            const user_id = message.user_id;
            if (!hasVideoChatRoom(caller_id)) {
              ws.send(JSON.stringify({ type: "calling-user-not-found" }));
            } else {
              const callingClient = getvideoChatRoom(caller_id);
              const initiateCallClient = getvideoChatRoom(user_id);
              initiateCallClient.send(
                JSON.stringify({ type: "initiate-call" })
              );
              callingClient.send(
                JSON.stringify({ type: "incoming-call", caller_id: user_id })
              );
            }
          }

          if (message.type == "rejectCall") {
            const caller_id = message.caller_id;
            const client = getvideoChatRoom(caller_id);
            client.send(JSON.stringify({ type: "call-rejected" }));
          }

          if (message.type == "requesting-sdp") {
            const caller_id = message.caller_id;
            const user_id = message.user_id;
            const client = getvideoChatRoom(caller_id);
            // console.log("in requesting sdp", caller_id);
            client.send(
              JSON.stringify({
                type: "requesting-sdp",
                caller_id: caller_id,
                user_id: user_id,
              })
            );
          }

          if (message.type == "offer") {
            const caller_id = message.caller_id;
            const user_id = message.user_id;
            const client = getvideoChatRoom(caller_id);
            const offer = message.offer;
            client.send(
              JSON.stringify({
                type: "remoteOffer",
                remoteOffer: offer,
                caller_id: caller_id,
              })
            );
          }

          if (message.type == "answer") {
            const caller_id = message.caller_id;
            const answer = message.answer;
            const client = getvideoChatRoom(caller_id);
            client.send(
              JSON.stringify({ type: "remoteAnswer", remoteAnswer: answer })
            );
          }

          if (message.type == "candidate") {
            const caller_id = message.caller_id;
            if (caller_id) {
              const candidate = message.candidate;
              const client = getvideoChatRoom(caller_id);
              client.send(
                JSON.stringify({ type: "candidate", candidate: candidate })
              );
            }
          }

          if (message.type == "stop:call") {
            const caller_id = message.callerId;
            console.log(caller_id);
            if (caller_id) {
              const client = getvideoChatRoom(caller_id);

              if(client)client.send(JSON.stringify({ type: "stop:call" }));
            }
          }
        } catch (error) {
          console.log("error from the video-chat on message: ", error);
        }
      });

      ws.on("close", () => {
        videoChatRoom.delete(user_id);
      });
    }
  });
};
