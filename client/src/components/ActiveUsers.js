import React, { useEffect, useState} from 'react';
import { BsPersonCircle } from "react-icons/bs";

const ActiveUsers = ({ socket }) =>{

    const [activeUsers, setActiveUsers] = useState([])

    useEffect(() =>{
        socket.off("who_join").on("who_join", (data) =>{
            setActiveUsers(data);
        });
        socket.off("user_disconnected").on("user_disconnected", (data) =>{
            setActiveUsers(activeUsers.filter(item => item.username !== data.username));
        });
    }, [socket, activeUsers])

    let activeUsersLength = activeUsers.length
    return(
        <ul className="active-users-list">
            {activeUsers.map((user) =>
                <li key={ activeUsersLength++ } className="active-user" >
                    <p><BsPersonCircle className="icon" />{user.username}</p>
                    <p>Room ID: {user.room}</p>
                </li>
            )}
        </ul>
    )
}

export default ActiveUsers