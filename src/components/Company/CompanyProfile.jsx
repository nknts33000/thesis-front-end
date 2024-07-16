import React, { useState, useEffect, useRef } from 'react';
import {Container, Row, Col, Card, Button, Modal, Form, Image, CardBody, CardTitle} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlusCircle, faTrash, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import CompanyImage from "../Images/CompanyImage";
import Post from "../Posts/Post";

const CompanyProfilePage = () => {
    const [company, setCompany] = useState(null);
    const [postdtos, setPostdtos] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const { companyId } = useParams();
    const user_id=localStorage.getItem('user_id');
    const token = localStorage.getItem('auth_token');
    const fileInputRef = useRef(null); // Reference for the hidden file input
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const [logo, setLogo] = useState(null);
    const [selectedTab, setSelectedTab] = useState("posts"); // State for the selected tab
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin]=useState(false);
    const [showMissionModal,setShowMissionModal]=useState(false);
    const [mission, setMission] = useState('');
    const [trigger, setTrigger] = useState(0);
    const [follows,setFollows]=useState(false);

    useEffect(() => {
        fetchCompanyData();
        fetchCompanyPosts();
        followerStatus();

        fetchCompanyLogo();
        fetchAdminData();
    }, []);

    const fetchAdminData = async ()=>{
        try {
            const response = await axios.get(`http://localhost:8080/user/isAdmin/${user_id}/${companyId}`, {
                headers: {
                    "Content-Type": "Application/Json",
                    Authorization: `Bearer ${token}`
                }
            });
            setIsAdmin(response.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

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
            console.log('posts of company',response.data)
            setPostdtos(response.data);
        } catch (error) {
            console.error("Error fetching company posts", error);
        }
    };


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
                    setTrigger(prev => prev+1);
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        }
    };

    const toJobPage = (advertId) =>{
        navigate(`/advert/${companyId}/${advertId}`)
    };

    const handleCloseMissionModal = () => {
        setShowMissionModal(false);
        // Reset about me content if user cancels
        setMission(company ? company.mission || '' : '');
    };

    const handleMissionChange = (event) => {
        setMission(event.target.value);
    };

    const follow = async()=>{
        axios.put(`http://localhost:8080/user/follow/${user_id}/${companyId}`,{},{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(response=>{
            followerStatus();
        }).catch(e=>{
            console.log('error following:',e);
        });
    };

    const handleSaveMission = () => {
        // Send a request to save the about me content
        axios.put(
            `http://localhost:8080/user/setMission/${companyId}`,
            { mission: mission },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                console.log("Mission saved successfully:", response.data);
                setShowMissionModal(false);
                fetchCompanyData();
            })
            .catch(error => {
                console.error("Error saving mission:", error);
            });
    };

    const followerStatus = async() =>{
        axios.get(`http://localhost:8080/user/isFollower/${user_id}/${companyId}`, {
            headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` }
        }).then(
            res=>{
                setFollows(res.data);
            }
        ).catch(e=>{
            console.log('problem fetching follower status:',e);
        })
    };

    const unfollow= async ()=>{
        axios.put(`http://localhost:8080/user/unfollow/${user_id}/${companyId}`,{},{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(response=>{
            followerStatus();
        }).catch(e=>{
            console.log('error unfollowing:',e);
        })
    };


    if (!company) return <div>Loading...</div>;

    return (
        <Container>

            <Row className="mt-4">
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <CompanyImage companyId={companyId} size={'150px'} trigger={trigger} />
                            {isAdmin &&
                                <FontAwesomeIcon icon={faPlusCircle} size="lg" className="ml-2" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
                            }
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <h3 style={{marginLeft:'20px'}}>{company.name}</h3>
                            {!isAdmin && (follows?(
                                    <Button variant="secondary" onClick={unfollow}>
                                        Unfollow
                                    </Button>
                                ):(
                                    <Button variant="primary" onClick={follow}>
                                        Follow
                                    </Button>
                                ))
                            }
                        </Card.Body>
                    </Card>
                    <Card style={{marginTop:'15px',width:'250%'}}>
                        <Card.Body>
                            <Card.Title>Mission
                                {isAdmin &&
                                    <FontAwesomeIcon icon={faPencilAlt} className="ml-2" style={{ cursor: 'pointer' }} onClick={() => setShowMissionModal(true)} />
                                }
                            </Card.Title>
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
                                    {isAdmin &&
                                            <Button variant="primary" onClick={handleAddPost}>
                                                Add Post
                                                {/*<FontAwesomeIcon icon={faPlusCircle} />*/}
                                            </Button>
                                        }

                                    <Post initialPostDtos={postdtos} fetchPosts={fetchCompanyPosts}/>
                                </>

                    )}
                    {selectedTab === "jobs" && (
                        <>
                                { isAdmin &&
                                    <Button variant="primary" onClick={handleAddJob} style={{marginBottom: '10px'}}>
                                        Add Job
                                        {/*<FontAwesomeIcon icon={faPlusCircle} />*/}
                                    </Button>
                                }
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

            <Modal show={showMissionModal} onHide={handleCloseMissionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit About Me</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formAboutMe">
                            <Form.Label>About Me</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={mission}
                                onChange={handleMissionChange}
                                placeholder="Enter about me content"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMissionModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveMission}>Save</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{'Add Post'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
