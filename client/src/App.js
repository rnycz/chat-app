import './styles/styles.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './components/Chat';
import ActiveUsers from './components/ActiveUsers'
import { BsPersonCircle } from "react-icons/bs";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinData = {
    username: username,
    room: room
  }

  const joinRoom = () =>{
    if(username !== "" && room !== ""){
      socket.emit("join_room", room)
      socket.emit("who_join", joinData)
      setShowChat(true)
    }
  }

  return (
    <div className="App">
      { !showChat ? (
        <div className="join-chat-container">
        <h3>Join Chat</h3>
        <input type="text" placeholder="Username..." 
        onChange={(event) =>{
          setUsername(event.target.value)
          }} />
        <input type="text" placeholder="Room ID..." 
        onChange={(event) =>{
          setRoom(event.target.value)
        }} />
        <button onClick={joinRoom} >Join a room</button>
      </div>)
      : (
        <div className="app-container">
          <div className="sidebar">
            <div className="info-container">
              <p className="username"><BsPersonCircle className="icons" />{username}</p>
              <p className="room">Room ID: {room}</p>
            </div>
            <hr />
            <h2>Active Users</h2>
            <ActiveUsers socket={socket} />
          </div>
          <div className="main">
            <div className="chat-container">
              <Chat socket={socket}
              username={username}
              room={room} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;