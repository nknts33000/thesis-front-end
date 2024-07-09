import { Button, Modal } from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import ConversationItem from "./ConversationItem";
import "./Conversations.css";
import ChatBox from "./ChatBox";
import axios from "axios";

const Conversations = ({ messageModal, closeMessageModal }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    // const [messages, setMessages] = useState([]);
    const user_id=localStorage.getItem('user_id');
    const [showChatBox,setShowChatBox]= useState(false);
    const [convos,setConvos]=useState({});
    const token=localStorage.getItem('auth_token');
    const prevMessageModal = useRef();

    // useEffect(()=>{
    //     getConvos();
    // },[])

    useEffect(() => {
        if (prevMessageModal.current === false && messageModal === true) {
            getConvos();
        }
        prevMessageModal.current = messageModal;
    }, [messageModal]);

    const getConvos = () =>{
        axios.get(`http://localhost:8080/user/getConvos/${user_id}`,{ headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('conversations:');
                console.log(response.data);
                setConvos(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the experiences!", error);
            });


    };

    const openChatBox = () =>{
        setShowChatBox(true);
    };

    const closeChatBox = ()=>{
        setSelectedUser(null);
        // setMessages([]);
        setShowChatBox(false);
        getConvos();
    };

    // useEffect(() => {
    //     if (selectedUser) {
    //         setMessages(conversations[JSON.stringify(selectedUser)] || []);
    //     }
    // }, [selectedUser, conversations]);

    const handleConversationClick = (user) => {
        setSelectedUser(user);
        // setMessages(conversations[JSON.stringify(selectedUser)] || []);
        console.log(selectedUser?.id)
        openChatBox();
        closeMessageModal();
    };

    return (
        <>
            <Modal show={messageModal} onHide={closeMessageModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Messages</Modal.Title>
                </Modal.Header>
                <Modal.Body className="conversations-modal-body">
                    <div className="conversations-list">
                        {Object.keys(convos).map((userJson) => {
                            const user = JSON.parse(userJson);
                            const latestMessage = convos[userJson][convos[userJson].length - 1]; // Get the last message in the list. The latest messages are in the end of the array
                            //const latestMessage = convos[userJson][0]; // Assuming the latest message is the first one in the list
                            console.log('latest message')
                            console.log(latestMessage);
                            return (
                                <ConversationItem
                                    key={user.id}
                                    user={user}
                                    latestMessage={latestMessage}
                                    onClick={() => handleConversationClick(user)}
                                />
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeMessageModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {selectedUser && (
                <ChatBox show={showChatBox} handleClose={closeChatBox} user_id={user_id} id={selectedUser?.id} />
            )}
        </>
    );
};

export default Conversations;

