import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Form, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare} from '@fortawesome/free-solid-svg-icons';
import './LandingPage.css';


function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [newComments, setNewComments] = useState({}); // State variable for new comments
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('auth_token') === null || localStorage.getItem('auth_token') === 'null') {
            navigate('/login');
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


        // const fetchComments = async (posts) => {
        //     const token = localStorage.getItem('auth_token');
        //     const headers = {
        //         'Authorization': `Bearer ${token}`
        //     };
        //
        //     // Use Promise.all to handle multiple fetch requests simultaneously
        //     const updatedPosts = await Promise.all(posts.map(async (post) => {
        //         console.log(post)
        //         const response = await fetch(`http://localhost:8080/user/getComments/${post.post.postId}`, {
        //             method: 'GET',
        //             headers: headers
        //         });
        //
        //         if (response.ok) {
        //             const comments = await response.json();
        //             console.log("comments");
        //             console.log(comments)
        //             post.comments = comments; // Store the comments in the post object
        //         } else {
        //             post.comments = []; // Default to an empty array if fetching fails
        //             console.error('Failed to fetch comments for post:', post.postId);
        //         }
        //         return post; // Return the post with or without new comments
        //     }));
        //
        //     // Update the posts state with comments included
        //     setPosts(updatedPosts);
        // };
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
            <h2>Welcome to Your App! User ID: {id}</h2>
            <p>This is the welcome page after successful login.</p>
            <Button variant="primary" onClick={handleShowModal}>New post</Button>

            {posts.length > 0 ? (

                posts.map((post, index) => (

                    <Card key={index} className="mt-3">
                        <Card.Title>
                            <Image
                                src={post.profile && post.profile.picture_url ? post.profile.picture_url : ""}
                                roundedCircle
                                style={{ marginRight: '10px', width: '30px', height: '30px' }}
                            />
                        </Card.Title>
                        <Card.Body>
                            <Card.Title>{post.firstname} {post.lastname}</Card.Title>
                            <Card.Text>{post.post.content }</Card.Text>
                            <div>
                                <FontAwesomeIcon icon={faThumbsUp} style={{cursor: 'pointer', marginRight: '10px'}} />
                                <FontAwesomeIcon icon={faComment} style={{cursor: 'pointer', marginRight: '10px'}} />
                                <FontAwesomeIcon icon={faShare} style={{cursor: 'pointer', marginRight: '10px'}} />
                            </div>
                        </Card.Body>
                        {/* Comments section */}
                        <div className="comments-section">


                            {/* New comment input */}
                            <div className="new-comment-input">
                                <textarea
                                    value={newComments[index] || ''}
                                    onChange={(event) => handleCommentChange(index, event)}
                                    placeholder="Add a comment..."
                                    className="comment-input"
                                />
                                <button onClick={() => submitComment(index)}>Post</button>

                            </div>
                            {/* Existing comments */}
                            <div className="existing-comments mb-2">
                                {post.comments.map((comment, cIndex) => (
                                    <div key={cIndex} className="p-2 border rounded my-1 bg-light">

                                        {/* Display commentator's profile picture */}
                                        <div className="commentator-info">
                                            <Image
                                                src={comment.picture_url ? comment.user.picture_url : ""}
                                                roundedCircle
                                                style={{ marginRight: '10px', width: '30px', height: '30px' }}
                                            />
                                            <strong>{comment.firstname} {comment.lastname}</strong>
                                        </div>
                                        {/* Comment text */}
                                        <div>{comment.content}</div>


                                    </div>
                                ))}
                            </div>

                        </div>
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
