import React, {useState} from "react";
import ChatBox from "./ChatBox";
import UserImage from "../Images/UserImage";

const ConversationItem = ({ user, latestMessage, onClick }) => {


    return (
        <>
            <div className="conversation-item" onClick={() => onClick(user)}>
                {/*<img*/}
                {/*    src={user.profile.profilePicture || "default-avatar.png"} // Use a default image if no profile picture*/}
                {/*    alt={user.firstname}*/}
                {/*    className="conversation-avatar"*/}
                {/*/>*/}
                <UserImage id={user.id} size={'60px'} />
                <div className="conversation-details" style={{marginLeft:'20px'}}>
                    <div className="conversation-name" >
                        {user.firstname} {user.lastname}
                    </div>
                    <div className="conversation-latest-message">
                        {latestMessage.content}
                    </div>
                </div>
            </div>


        </>
    );
};

export default ConversationItem;
