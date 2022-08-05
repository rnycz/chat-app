import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { GoPrimitiveDot } from 'react-icons/go';

const Chat = ({ socket, username, room }) =>{
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])

    const pad = (num) => ("0" + num).slice(-2);
    const setTime = () => {
      const date = new Date();
      let hours = date.getHours(),
      minutes = date.getMinutes();
      return pad(hours) + ":" + pad(minutes);
    }

    const sendMessage = async () =>{
        if(currentMessage !== ""){
            let messageListLength = messageList.length;
            const messageData = {
                id: messageListLength++,
                room: room,
                author: username,
                message: currentMessage,
                time: setTime()
            }
            await socket.emit("send_message", messageData)
            setMessageList((list) =>[...list, messageData])
            setCurrentMessage("")
        }
    }

    useEffect(() =>{
        socket.off("receive_message").on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
          });
    }, [socket])

    return(
        <div className="chat-window">
            <div className="chat-header">
                <p><GoPrimitiveDot  className="icon" /> Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) =>{
                        return (
                        <div className="message" id={username === messageContent.author ? "you" : "other"} key={messageContent.id} >
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" placeholder="Type..."
                value={currentMessage}
                    onChange={(event) =>{
                        setCurrentMessage(event.target.value)
                        }} 
                    onKeyPress={(event) =>{
                        event.key === "Enter" && sendMessage()
                    }} />
                <button onClick={sendMessage} >&#9658;</button>
            </div>
        </div>
    )
}

export default Chat