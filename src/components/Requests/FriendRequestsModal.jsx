import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import UserImage from "../Images/UserImage";
import {useNavigate} from "react-router-dom";

const FriendRequestsModal = ({ friendListModal, handleCloseFriendListModal }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('auth_token');
    const navigate=useNavigate();

    useEffect(() => {
        if (friendListModal) {
            fetchFriendRequests();
        }
    }, [friendListModal]);

    const fetchFriendRequests = () => {
        axios.get(`http://localhost:8080/user/pendingRequests/${user_id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setFriendRequests(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error("There was an error fetching the friend requests!", error);
            });
    };

    const toUsersProf = (id) =>{
        navigate(`/user/${id}`);
        handleCloseFriendListModal();
    };

    const acceptFriendRequest = async (id) =>{
        axios.put(`http://localhost:8080/user/accept_friend/${user_id}/${id}`,{}, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                //setConnection(response.data);
                fetchFriendRequests();
            })
            .catch(error => {
                console.error("There was an error cancelling the friend request!", error);
            });
    };

    const rejectFriendRequest =async (id)=>{
        axios.delete(`http://localhost:8080/user/reject_friend/${user_id}/${id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                //setConnection({...connection,connection_status:''});
                fetchFriendRequests();
            })
            .catch(error => {
                console.error("There was an error rejecting the friend request!", error);
            });
    };

    return (
        <Modal show={friendListModal} onHide={handleCloseFriendListModal}>
            <Modal.Header closeButton>
                <Modal.Title>Friend Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {friendRequests.length>0?(
                    friendRequests.map(request => (
                        <div key={request.id} style={{marginBottom:'60px'}}>
                            <div style={{cursor:'pointer'}} onClick={()=>toUsersProf(request.user1.id)}>
                                <UserImage id={request.user1.id} size={'70px'} />
                                <p>{request.user1.firstname} {request.user1.lastname}</p>
                            </div>

                            <Button variant="success" onClick={() => acceptFriendRequest(request.user1.id)}>Accept</Button>
                            <Button variant="danger" onClick={() => rejectFriendRequest(request.user1.id)}>Decline</Button>
                        </div>
                    ))
                ): (
                    <div><h5>No new requests.</h5></div>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseFriendListModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FriendRequestsModal;
