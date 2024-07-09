import React, {useState} from "react";
import ChatBox from "./ChatBox";

const ConversationItem = ({ user, latestMessage, onClick }) => {


    return (
        <>
            <div className="conversation-item" onClick={() => onClick(user)}>
                <img
                    src={user.profile.profilePicture || "default-avatar.png"} // Use a default image if no profile picture
                    alt={user.firstname}
                    className="conversation-avatar"
                />
                <div className="conversation-details">
                    <div className="conversation-name">
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
