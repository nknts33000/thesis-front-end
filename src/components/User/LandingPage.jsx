import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Form, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare} from '@fortawesome/free-solid-svg-icons';
import './LandingPage.css';
import Post from "../Posts/Post";


function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [newComments, setNewComments] = useState({}); // State variable for new comments
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('auth_token') === null || localStorage.getItem('auth_token') === 'null') {
            navigate('/');
        }
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
                //fetchComments(data);
            } else {
                console.error('Failed to fetch posts');
            }
        };

        fetchPosts();
    }, [navigate]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handlePostSubmit = async () => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const body = { "content":content, "token":token };
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

    const handleCommentChange = (index, event) => {
        const { value } = event.target;
        setNewComments(prevState => ({
            ...prevState,
            [index]: value
        }));

    };

    const submitComment = async (index) => {
        const post = posts[index]; // Access the specific post using the index

        if (!post || !post.post) {
            console.error("Invalid post or postId");
            return;
        }
        const post_id = post.post.postId;
        console.log("postId submit comment:"+post_id)
        //console.log(newComments[index])
        const content = newComments[index];
        console.log(content)
        if (!content || content.trim() === '') {
            console.log("Comment is empty.");
            return;
        }
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };



        const body = {
            token : token,
            content : content,
            post_id : post_id.toString() // Assuming each post has an 'id' field
        };

        const url = 'http://localhost:8080/user/addComment'; // Update this URL to your server's URL for posting comments

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response;
                console.log("Comment submitted:", data);
                // Optionally update UI or state here
                setNewComments(prevState => ({
                    ...prevState,
                    [post_id]: '' // Clear input field after successful submission
                }));
                // Refresh comments or manage state updates as needed
            } else {
                throw new Error('Failed to submit comment');
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };


    return (
        <Container className="mt-5">
            <h2>Welcome to JobNet! </h2>
            <p>This is the welcome page after successful login.</p>
            <Button variant="primary" onClick={handleShowModal}>New post</Button>

            <Post initialPostDtos={posts} />

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
