const callButton = document.getElementById("callButton");
const localVideo = document.getElementById("localVideo");
let stream;
let localStream;
let peerConnection;

const peerConfig = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

const constraints = {
  video: true,
  audio: true,
};

const initiateCall = async () => {
  try {
    // Access the media devices and set the local video stream
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    localVideo.srcObject = stream;
    localStream = stream;

    // Create the peer connection
    await createPeerConnection();

    // Create and set the local offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log("Offer: ", offer);
    } catch (error) {
      console.log("Error creating or setting local description:", error);
    }

  } catch (error) {
    console.log("Error accessing media devices:", error);
  }
};

const createPeerConnection = () => {
  return new Promise((resolve, reject) => {
    // Create the peer connection
    peerConnection = new RTCPeerConnection(peerConfig);
    
    // Add local tracks to the peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Listen for ICE candidates
    peerConnection.addEventListener('icecandidate', (e) => {
      if (e.candidate) {
        console.log("ICE candidate found:", e.candidate);
        // You can send the candidate to the remote peer here
      }
    });

    // Resolve the promise once the peer connection is created
    resolve(peerConnection);
  });
};

callButton.addEventListener("click", () => {
  initiateCall();
});

