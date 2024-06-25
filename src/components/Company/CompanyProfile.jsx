import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlusCircle, faTrash, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useParams} from "react-router-dom";

const CompanyProfilePage = () => {
    const [company, setCompany] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [currentPost, setCurrentPost] = useState({ title: "", content: "" });
    const {companyId} = useParams();
    const token=localStorage.getItem('auth_token');

    useEffect(() => {
        fetchCompanyData();
        //fetchCompanyPosts();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getCompany/${companyId}`,{ headers:
                    { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } });
            setCompany(response.data);
        } catch (error) {
            console.error("Error fetching company data", error);
        }
    };

    const fetchCompanyPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getPostsOfCompany/${companyId}`,{ headers:
                    { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } });
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching company posts", error);
        }
    };

    const handleSavePost = async () => {
        try {
            if (currentPost.postId) {
                await axios.put(`/api/posts/${currentPost.postId}`, currentPost);
            } else {
                await axios.post(`/api/companies/${companyId}/posts`, currentPost);
            }
            setShowPostModal(false);
            fetchCompanyPosts();
        } catch (error) {
            console.error("Error saving post", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`/api/posts/${postId}`);
            fetchCompanyPosts();
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setShowPostModal(true);
    };

    const handleAddPost = () => {
        setCurrentPost({ title: "", content: "" });
        setShowPostModal(true);
    };

    if (!company) return <div>Loading...</div>;

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4} className="text-center">
                    <Image
                        src={company.companyLogo || 'placeholder.jpg'}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <h3>{company.name}</h3>
                    <p>{company.mission}</p>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Posts
                                <Button variant="link" onClick={handleAddPost}>
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                </Button>
                            </Card.Title>
                            {posts.map((post, index) => (
                                <Card key={index} className="mb-2">
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>{post.content}</Card.Text>
                                        <Button variant="link" onClick={() => handleEditPost(post)}>
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </Button>
                                        <Button variant="link" onClick={() => handleDeletePost(post.postId)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                        <Button variant="link">
                                            <FontAwesomeIcon icon={faThumbsUp} />
                                        </Button>
                                        <Button variant="link">
                                            <FontAwesomeIcon icon={faComment} />
                                        </Button>
                                        <Button variant="link">
                                            <FontAwesomeIcon icon={faShare} />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentPost.postId ? 'Edit Post' : 'Add Post'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={currentPost.content}
                                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPostModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSavePost}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CompanyProfilePage;
