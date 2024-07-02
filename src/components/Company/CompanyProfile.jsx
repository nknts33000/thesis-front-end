import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlusCircle, faTrash, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

const CompanyProfilePage = () => {
    const [company, setCompany] = useState(null);
    const [posts, setPosts] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const { companyId } = useParams();
    const token = localStorage.getItem('auth_token');
    const fileInputRef = useRef(null); // Reference for the hidden file input
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const [logo, setLogo] = useState(null);
    const [selectedTab, setSelectedTab] = useState("posts"); // State for the selected tab
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanyData();
        fetchCompanyPosts();
        //fetchCompanyJobs();
        fetchCompanyLogo();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getCompany/${companyId}`, {
                headers: {
                    "Content-Type": "Application/Json",
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            setCompany(response.data);
        } catch (error) {
            console.error("Error fetching company data", error);
        }
    };

    const fetchCompanyLogo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getCompanyLogo/${companyId}`, {
                headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` },
                responseType: 'arraybuffer' // Ensure response is treated as an array buffer
            });

            // Create a blob from the byte array
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create an object URL from the blob
            const imageUrl = URL.createObjectURL(blob);

            // Set the image URL as the logo
            setLogo(imageUrl);
        } catch (error) {
            console.error("Error fetching company logo", error);
        }
    };

    const fetchCompanyPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getPostsOfCompany/${companyId}`, {
                headers: {
                    "Content-Type": "Application/Json",
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching company posts", error);
        }
    };

    // const fetchCompanyJobs = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/user/getJobsOfCompany/${companyId}`, {
    //             headers: {
    //                 "Content-Type": "Application/Json",
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         setJobs(response.data);
    //     } catch (error) {
    //         console.error("Error fetching company jobs", error);
    //     }
    // };

    const handleAddJob = () =>{
        navigate('/createAdvert', {state:{company}})
    };

    const handleSavePost = async () => {
        try {
           // if (currentPost.postId) {
              //  await axios.put(`/api/posts/${currentPost.postId}`, currentPost);
           // } else {
                await axios.post(`http://localhost:8080/user/addCompanyPost/${companyId}`,
                    JSON.stringify({
                    "content": currentPost,
                    "token": token
                }),
                    {headers: {
                "Content-Type": "Application/Json",
                    Authorization: `Bearer ${token}`
                }});
            //}
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

    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger click on file input
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);

            // Upload the image to the server if needed
            const formData = new FormData();
            formData.append('file', file);

            axios.put(`http://localhost:8080/user/updateCompanyPic/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Image uploaded successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        }
    };

    const toJobPage = (advertId) =>{
        navigate(`/advert/${companyId}/${advertId}`)
    };

    if (!company) return <div>Loading...</div>;

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4} className="text-center">
                    <Image
                        src={logo || 'placeholder.jpg'}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={handleImageClick}
                    />
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" className="ml-2" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <h3>{company.name}</h3>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Mission</Card.Title>
                            <p>{company.mission}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <Button variant={selectedTab === "posts" ? "primary" : "secondary"} onClick={() => setSelectedTab("posts")}>Posts</Button>
                    <Button variant={selectedTab === "jobs" ? "primary" : "secondary"} onClick={() => setSelectedTab("jobs")} className="ml-2">Jobs</Button>
                </Col>
            </Row>
            <hr/>
            <Row className="mt-4">
                <Col md={12}>
                    {selectedTab === "posts" && (


                                    <>
                                    <Button variant="primary" onClick={handleAddPost}>
                                        Add Post
                                        {/*<FontAwesomeIcon icon={faPlusCircle} />*/}
                                    </Button>

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
                                </>

                    )}
                    {selectedTab === "jobs" && (
                        <>
                        <Button variant="primary" onClick={handleAddJob} style={{marginBottom: '10px'}}>
                            Add Job
                            {/*<FontAwesomeIcon icon={faPlusCircle} />*/}
                        </Button>
                             {company.adverts.map((job, index) => (
                                    <Card key={index} className="mb-2" style={{cursor:'pointer'}} >
                                        <Card.Body onClick={()=>toJobPage(job.advertId)}>
                                            <Card.Title>{job.jobTitle}</Card.Title>
                                            {/*<Card.Text>{job.jobSummary}</Card.Text>*/}
                                            <Card.Text><strong>Location:</strong> {job.location}</Card.Text>
                                            <Card.Text><strong>Contact information:</strong> {job.contactInformation}</Card.Text>
                                            {/* Add any other job details you want to display here */}
                                        </Card.Body>
                                    </Card>
                                ))}
                        </>
                    )}
                </Col>
            </Row>

            <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{'Add Post'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    {/*    <Form.Group>*/}
                    {/*        <Form.Label>Title</Form.Label>*/}
                    {/*        <Form.Control*/}
                    {/*            type="text"*/}
                    {/*            value={currentPost.title}*/}
                    {/*            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}*/}
                    {/*        />*/}
                    {/*    </Form.Group>*/}
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                // value={currentPost? currentPost : ''}
                                onChange={(e) => setCurrentPost(e.target.value)}
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
