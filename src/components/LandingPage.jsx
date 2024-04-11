import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Card } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare} from '@fortawesome/free-solid-svg-icons';
function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch('http://localhost:8080/user/get_friends_posts', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ token: token })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setPosts(data);
            } else {
                console.error('Failed to fetch posts');
            }
        };

        fetchPosts();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handlePostSubmit = async () => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const body = { content, token };
        const url = 'http://localhost:8080/user/post';
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).catch((err) => {
            console.log(err);
        });
        handleCloseModal();
    };

    return (
        <Container className="mt-5">
            <h2>Welcome to Your App! User ID: {id}</h2>
            <p>This is the welcome page after successful login.</p>
            <Button variant="primary" onClick={handleShowModal}>New post</Button>

            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <Card key={index} className="mt-3">
                        <Card.Body>
                            <Card.Text>{post.content}</Card.Text>
                            <div>
                                <FontAwesomeIcon icon={faThumbsUp} style={{cursor: 'pointer', marginRight: '10px'}} />
                                <FontAwesomeIcon icon={faComment} style={{cursor: 'pointer', marginRight: '10px'}} />
                                <FontAwesomeIcon icon={faShare} style={{cursor: 'pointer', marginRight: '10px'}} />
                            </div>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <div className="mt-3">No posts yet.</div>
            )}

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

export default LandingPage;
