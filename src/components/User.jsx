import React, { useState } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";

function User() {
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const { id } = useParams();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handlePostSubmit = () => {
        // Handle the submission of the post content here (e.g., send it to the server)
        console.log('Submitted post:', postContent);
        // After submitting, close the modal
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
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
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

export default User;
