const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
const peer = new Peer(customGenerationFunction());
const txtRoom = document.getElementById('txtRoom');
const myVideo= document.getElementById("myVideo");
const friendVideo= document.getElementById("friendVideo");
myVideo.muted = true; 
 
myVideo.style.transform= "scaleX(-1)";
friendVideo.style.transform= "scaleX(-1)";
peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  document.getElementById("peerID").value=id
document.getElementById("shareId").href="whatsapp://send?text=Join me with ID: " + id;
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
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
     attachVideoStream(friendVideo, userVideoStream)
   })
  });

})


