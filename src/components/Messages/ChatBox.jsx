// src/ChatBox.js
import React, {useEffect, useState} from 'react';
import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap';
import './Chatbox.css';
import axios from "axios";

const ChatBox = ({ show, handleClose, user_id, id }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const token=localStorage.getItem('auth_token');

    useEffect(() => {
        getAllMessages();

        console.log('user_id:'+user_id)
    }, []);

    const getAllMessages = async ()=>{
        axios.get(
            `http://localhost:8080/user/between/${user_id}/${id}`,{ headers:
                    { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } }
        ).then(response =>{
            console.log(response.data)
            setMessages(response.data)
        }).catch(error => {
            console.error("There was an error fetching the messages!", error);
        });
    };

    const handleSend = () => {
        if (input.trim() === '') return;

        //setMessages([...messages, { text: input, sender: 'self' }]);


        axios.post(
            `http://localhost:8080/user/sendMessage/${user_id}/${id}`,
            JSON.stringify({
                "content": input,
            }), // The data to be sent in the request body
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                getAllMessages();
            })
            .catch(error => console.error(error));

        setInput('');
    };

    const handleInput = (e) => setInput(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Modal show={show} onHide={handleClose} className="chat-box" animation={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="chat-content">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.sender.id == user_id ? 'sent' : 'received'}`}
                        >
                            <span>{message.content}</span>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <InputGroup>
                    <FormControl
                        placeholder="Type a message..."
                        value={input}
                        onChange={handleInput}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="primary" onClick={handleSend}>Send</Button>
                </InputGroup>
            </Modal.Footer>
        </Modal>
    );
};

export default ChatBox;
