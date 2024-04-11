import React, { useState } from 'react';
import {Container,Button, Modal, Form} from 'react-bootstrap';
import {useParams} from "react-router-dom";

function UserProfile() {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const { id } = useParams();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handlePostSubmit = async () => {
        const token =localStorage.getItem('auth_token')
        console.log(localStorage.getItem('auth_token'));
        const headers={
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }

        const body = {content,token}
        const url='http://localhost:8080/user/post';
        await fetch(url, {
            method:'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).catch((err) =>{
            console.log(err);
        })
        handleCloseModal();
    };

    return (
        <Container className="mt-5">
            <h2>Welcome to Your App! User ID: {id}</h2>
            <p>This is the welcome page after successful login.</p>
            <Button variant="primary" onClick={handleShowModal}>New post</Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Label>Post Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handlePostSubmit}>Add post</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UserProfile;
