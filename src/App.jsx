import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./Api";
import ReactPlayer from "react-player";
import './app.css'
import { assets } from "./assets/asstes";


function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    if (meetingId == null){
      alert("Please enter meeting Id!")
    }else{
      await getMeetingAndToken(meetingId);
    }
  };
  const onClickb = async () => {
      await getMeetingAndToken(meetingId);
    }
  return (
    <>
    <img src={assets.video} alt="" className="main-img"/><br /><br /><br /><br />
    <h1 className="heading">I-Connect</h1>
    <div className="main-align">
      <input
        type="text"
        placeholder="Enter Meeting Id"
        className="inpValue"
        onChange={(e) => {
            setMeetingId(e.target.value);
        }}
      />
      <div  className="btn-align">
      <button onClick={onClick} className="btn">Join</button>
      {" or "}
      <button onClick={onClickb} className="btn">Create Meeting</button>
      </div>
    </div>
    </>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="vid">
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
  </div>
  );
}

function Controls({props}) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  const [ismic, setIsMic] = useState(true);
  const [iscam, setIsCam] = useState(true);

  return (
    <div className="btn-controls">
      <button className="btn" onClick={() => leave()}>
        <img src={assets.logout} alt="" />
      </button>
      <button className="btn" onClick={() => toggleMic()}>
        <img src={ismic ? assets.mic : assets.mute} alt="" onClick={()=> setIsMic(!ismic)}/>
      </button>
      <button className="btn" onClick={() => toggleWebcam()}>
        <img src={iscam ? assets.webcam : assets.off} alt="" onClick={()=> setIsCam(!iscam)}/>
      </button>
      <button className="btn" onClick={()=>{navigator.clipboard.writeText(props)}}>
      <img src={assets.copy} alt="" />
      </button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="min">
      <h3 className="meetId container">Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div className="cont">
          <Controls props={props.meetingId}/>
          {/* //For rendering all the participants in the meeting */}
          <div className="invideo">
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
              className = 'inVideo'
            />
          ))}
          </div>
        </div>
      ) : joined && joined == "JOINING" ? (
        <p className="msg">Joining the meeting...</p>
      ) : (
        <div className="btn-align">
        <button className="btn" onClick={joinMeeting}>Join</button>
        <button className="btn" onClick={()=>{navigator.clipboard.writeText(props.meetingId)}}>Copy Meeting Id</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [name, setName] = useState(null);
  useEffect(()=>{
    window.onload = function(){
      const n = prompt("Enter your name ?");
      console.log(n);
      setName(n);
    }

    return ()=>{
      window.onload = null;
    };
  }, []);

  console.log(name);


  const [meetingId, setMeetingId] = useState(null);

  //Getting the meeting id by calling the api we just wrote
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: `${name}`,
      }}
      token={authToken}
      className = 'main'
    >
      <MeetingView  meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;