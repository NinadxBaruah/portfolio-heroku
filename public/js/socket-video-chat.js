let user_id;
let socket;
const modal = new Modal();
let caller_id;
let offer;
let remoteOffer;
let remoteAnswer;
let iceCandidates = [];



document.addEventListener("DOMContentLoaded", async () => {
  user_id = localStorage.getItem("video-chat-user-id");
  if (user_id === null) {
    user_id = await generateRandomString(8);
    localStorage.setItem("video-chat-user-id", user_id);
  }
  const userIdTag = document.getElementById("userId");
  userIdTag.textContent = user_id;
  console.log(user_id);

  // making socket conenction
  socket = new WebSocket(`wss://${process.env.backend_url}/video-chat`);

  socket.addEventListener("open", (event) => {
    console.log("Connected to server");

    socket.send(JSON.stringify({ type: "setUser", user_id: user_id }));
  });

  socket.addEventListener("message", (event) => {
    console.log("Message from server:", event.data);
    const data = JSON.parse(event.data);
    if (data.type == "calling-user-not-found") {
      console.log("user not found");
      modal.open({
        title: "User",
        message: "User not found!",
        buttonText: "Got it",
        backgroundColor: "#1e293b",
        textColor: "#f8fafc",
        accentColor: "#2563eb",
      });
    } else if (data.type == "incoming-call") {
      console.log("incoming call");
      caller_id = data.caller_id;
      callNotification.show({
        message: "User is calling",
        onAccept: async () => {
          // when user accept the call
          console.log("custom accept");
          caller_id = data.caller_id;
          // console.log(caller_id)
          await askForSdpFromRemoteUser();
        },
        onReject: () => {
          // when user reject the call
          console.log("custom reject");
          socket.send(JSON.stringify({ type: "rejectCall", caller_id: caller_id }));
        },
      });
    } else if(data.type == "call-rejected"){
      modal.open({
        title: "Rejected",
        message: "Call Request Rejected!",
        buttonText: "Got it",
        backgroundColor: "#1e293b",
        textColor: "#f8fafc",
        accentColor: "#2563eb",
      });
    }
    else if (data.type == "requesting-sdp") {
      socket.send(JSON.stringify({type:"offer" , offer:offer, caller_id:data.user_id , user_id:user_id}))
      caller_id = data.user_id
    }

    else if(data.type == "remoteOffer") {
      remoteOffer = data.remoteOffer;
      console.log(data.remoteOffer)
      receiveCall()
    }

    else if(data.type == "remoteAnswer") {
      remoteAnswer = data.remoteAnswer;
      addAnswer()
    }
    else if( data.type == "candidate") {
      console.log("ice candidate on socket: ",data.candidate)
      addNewIceCandidate(data.candidate)
      // iceCandidates.forEach((ice) =>{
      //   socket.send(
      //     JSON.stringify({
      //       type: "candidate",
      //       candidate: ice,
      //       caller_id: caller_id,
      //     })
      //   );
      // })
    }
    // Handle the received data
  });

  socket.addEventListener("close", (event) => {
    console.log("Connection closed", event);
    // You can check the `event.code` and `event.reason` for more details
  });

  // Initialize modal
});
