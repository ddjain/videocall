


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 50 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

if(!localStorage.getItem("peerId")){
	localStorage.setItem("peerId",uuidv4())
}

const peer = new Peer(localStorage.getItem("peerId"));
const txtRoom = document.getElementById('txtRoom');
const myVideo= document.getElementById("myVideo");
const friendVideo= document.getElementById("friendVideo");
myVideo.muted = true; 
 
myVideo.style.transform= "scaleX(-1)";
friendVideo.style.transform= "scaleX(-1)";


peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  document.getElementById("peerID").value=id
  document.getElementById("shareId").href="whatsapp://send?text=Hi, Call me at https://ddjain.github.io/videocall/index.html, Using my ID: " + id;
});


function attachVideoStream(video, stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}


function onBtnJoinClick(){
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    const call = peer.call(txtRoom.value,stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        attachVideoStream(friendVideo, userVideoStream)
    })
    call.on('close', () => {
     video.remove()
   })
  })
}


navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  attachVideoStream(myVideo,stream);
  peer.on('call', function(call) {
  // Answer the call, providing our mediaStream
    if(confirm("You got a call, press OK to accept")){
		call.answer(stream);
	    const video = document.createElement('video')
	    call.on('stream', userVideoStream => {
	     attachVideoStream(friendVideo, userVideoStream)
	   })
    }
  });

})


