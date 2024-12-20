import React, {useEffect, useRef, useState} from 'react';
import {Container, Row, Col, Image, Card, Button, Modal, Form, ButtonGroup} from 'react-bootstrap';
import {json, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faComment,
    faShare,
    faThumbsUp,
    faPencilAlt,
    faTrash,
    faPlusCircle,
    faUserMinus,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import ChatBox from "../Messages/ChatBox";
import UserImage from "../Images/UserImage";
import Post from "../Posts/Post";
import UserCard from "../Cards/UserCard";
import CompanyCard from "../Cards/CompanyCard";
import '../User/profile.css';
const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [posts, setPosts] = useState({});
    const [showExpModal, setShowExpModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    const [currentExp, setCurrentExp] = useState({});
    const [currentEdu, setCurrentEdu] = useState({});
    const [newComments, setNewComments] = useState({}); // State variable for new comments
    const token = localStorage.getItem('auth_token');
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const fileInputRef = useRef(null); // Reference for the hidden file input
    const [profilePicUrl,setProfilePicUrl]=useState(null);
    const [aboutMe, setAboutMe] = useState('');
    const [showAboutMeModal, setShowAboutMeModal] = useState(false);
    const user_id=localStorage.getItem('user_id');
    const { id } = useParams();
    const [connection,setConnection]=useState(null)
    const [showModal,setShowModal]=useState(false);
    const [content, setContent] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [showType,setShowType]=useState('Posts');
    const [friends,setFriends]=useState([]);
    const [followings,setFollowings]=useState([]);
    const [showSkillModal, setShowSkillModal] = useState(false);  // To toggle the skill modal visibility
    const [newSkill, setNewSkill] = useState('');  // To store the new skill input value



    useEffect(() => {
        console.log('token:'+token)
        if (token === null || token === 'null') {
            navigate('/login');
        } else {
            axios.get(`http://localhost:8080/user/findUser/${id}`, { headers:
                    { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the user!", error);
                });
        }
    }, [token,navigate]);

    useEffect(() => {
        // Whenever the id changes, update the trigger state
        setTrigger(prev => prev + 1);
    }, [id]);

    useEffect(() => {
        // Log connection state on change
        console.log('Connection state changed:', connection);
    }, [connection]);

    useEffect(() => {
        if (user) {

            getProfile();

            // axios.get(`http://localhost:8080/user/getExperiences/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            //     .then(response => {
            //         setExperiences(response.data);
            //         console.log('experience start:'+response.data.start_date)
            //         console.log('experience end:'+response.data.end_date)
            //     })
            //     .catch(error => {
            //         console.error("There was an error fetching the experiences!", error);
            //     });

            getEx();

            // axios.get(`http://localhost:8080/user/getEducation/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            //     .then(response => {
            //         setEducation(response.data);
            //     })
            //     .catch(error => {
            //         console.error("There was an error fetching the education!", error);
            //     });

            getEd();

            getPosts();

            getProfPic();

            getFriends();

            getFollowings();

            if(user_id!==id){
                axios.get(`http://localhost:8080/user/getConnection/${user_id}/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                    .then(response => {
                        setConnection(response.data);
                        console.log('user_id:', user_id);
                        console.log('id:', id);
                        console.log('connection user1 id:',response.data.user1.id);
                        console.log('connection user2 id:',response.data.user2.id);
                        //if(connection===null) console.log('null');
                    })
                    .catch(error => {
                        console.error("There was an error fetching the profile picture!", error);
                    });
            }


        }
    }, [user, token]);



    const handleAddSkill = () => {
        if(newSkill.trim()==='') {
            alert('Can\'t take an empty value');
            return;
        }

        axios.post(
            `http://localhost:8080/user/addSkill/${profile.profile_id}`,
            {"skill_name":newSkill.trim()}, // The data to be sent in the request body
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                setProfile(response.data);
                setNewSkill('');
                setShowSkillModal(false);
                //setShowExpModal(false);
            })
            .catch(error => {
                console.error(error);
                alert('Skill is already added.');
            });


    };

    const deleteSkill = (skill_id) =>{
        axios.delete(
            `http://localhost:8080/user/deleteSkill/${skill_id}`,
             // The data to be sent in the request body
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                setProfile(response.data);
                setNewSkill('');
                setShowSkillModal(false);
                //setShowExpModal(false);
            })
            .catch(error => console.error(error));
    };

    const convertTimestampToDate = (timestamp) => {
        if (!timestamp) return ''; // Return an empty string if timestamp is not set
        const date = new Date(timestamp); // Create a Date object from the timestamp
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
        return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
    };


    const getFriends = async () =>{
        axios.get(`http://localhost:8080/user/getAllFriends/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setFriends(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the friends!", error);
            });
    };

    const getFollowings = async () =>{
        axios.get(`http://localhost:8080/user/getAllFollowings/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setFollowings(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the friends!", error);
            });
    };

    const toggleChatBox = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getPosts=async ()=>{
        axios.get(`http://localhost:8080/user/getPosts/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data)
                setPosts(response.data);

            })
            .catch(error => {
                console.error("There was an error fetching the posts!", error);
            });
    };

    const getProfile =async ()=>{
        axios.get(`http://localhost:8080/user/getProfile/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setProfile(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error("There was an error fetching the profile!", error);
            });
    };

    const getProfPic =async ()=>{
        axios.get(`http://localhost:8080/user/profilePic/${user.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            responseType: 'arraybuffer'  // Ensures binary response
        })
            .then(response => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setProfilePicUrl(imageUrl);
            })
            .catch(error => {
                console.error("There was an error fetching the profile picture!", error);
            });
    };

    const getEd = async () => {
        axios.get(`http://localhost:8080/user/getEducation/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                const formattedEd = response.data.map(ed => ({
                    ...ed,
                    start_date: convertTimestampToDate(ed.start_date), // Convert start_date
                    end_date: convertTimestampToDate(ed.end_date), // Convert end_date
                }));
                setEducation(formattedEd);
            })
            .catch(error => {
                console.error("There was an error fetching the education!", error);
            });
    };

    const getEx = async () => {
        axios.get(`http://localhost:8080/user/getExperiences/${user.id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {

                const formattedExperiences = response.data.map(exp => ({
                    ...exp,
                    start_date: convertTimestampToDate(exp.start_date), // Convert start_date
                    end_date: convertTimestampToDate(exp.end_date), // Convert end_date
                }));
                setExperiences(formattedExperiences);
                console.log('experiences:',formattedExperiences)
            })
            .catch(error => {
                console.error("There was an error fetching the experiences!", error);
            });
    };

    const handleAboutMeChange = (event) => {
        setAboutMe(event.target.value);
    };

    const handleSaveAboutMe = () => {
        // Send a request to save the about me content
        axios.put(
            `http://localhost:8080/user/setSummary/${profile.profile_id}`,
            { summary: aboutMe },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                console.log("About me saved successfully:", response.data);
                setShowAboutMeModal(false);
                getProfile();
            })
            .catch(error => {
                console.error("Error saving about me:", error);
            });
    };

    const handleCloseAboutMeModal = () => {
        setShowAboutMeModal(false);
        // Reset about me content if user cancels
        setAboutMe(profile ? profile.summary || '' : '');
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
            //formData.append('user_id', user.id); // assuming user ID is needed for server-side

            axios.put(`http://localhost:8080/user/updateProfPic/${profile.profile_id}`, formData, {
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

    const handleSaveExperience = () => {
        console.log(currentExp.experience_id)
        if (currentExp.experience_id) {
            const index = experiences.findIndex(exp => exp.experience_id === currentExp.experience_id);
            if (index !== -1) {
                const updatedExperiences = [...experiences];
                updatedExperiences[index] = currentExp;

                axios.put(
                    `http://localhost:8080/user/updateExperience/${user.id}`,
                    currentExp,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    }
                )
                    .then(response => {
                        setExperiences(updatedExperiences);
                        setShowExpModal(false);
                    })
                    .catch(error => console.error(error));
            } else {
                console.error("Experience with provided ID not found.");
            }
        } else {
                    axios.post(
                        `http://localhost:8080/user/addExperience/${user.id}`,
                        currentExp, // The data to be sent in the request body
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                            }
                        }
                    )
                        .then(response => {
                            getEx();
                            setShowExpModal(false);
                        })
                        .catch(error => console.error(error));
        }
    };


    const handleSaveEducation = () => {
        console.log('start date', currentEdu.start_date)

        console.log('end date', currentEdu.end_date)
        if (currentEdu.education_id) {
            // If education_id exists, it means we are updating an existing education
            const index = education.findIndex(edu => edu.education_id === currentEdu.education_id);
            if (index !== -1) {
                // If the education exists in the state array, update it
                const updatedEducation = [...education];
                updatedEducation[index] = currentEdu;

                axios.put(
                    `http://localhost:8080/user/updateEdu/${user.id}`,
                    currentEdu,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    }
                )
                    .then(response => {
                        setEducation(updatedEducation);
                        setShowEduModal(false);
                    })
                    .catch(error => console.error(error));
            } else {
                console.error("Education with provided ID not found.");
            }
        } else {
            // If education_id doesn't exist, it means we are adding a new education
            axios.post(
                `http://localhost:8080/user/addEducation/${user.id}`,
                currentEdu,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                }
            )
                .then(response => {
                    getEd();
                    // setEducation([...education, currentEdu]);
                    setShowEduModal(false);
                })
                .catch(error => console.error(error));
        }
    };


    const handleDeleteExperience = (experience_id) => {
        axios.delete(`http://localhost:8080/user/deleteExperience/${experience_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
            )
            .then(() => {
                setExperiences(experiences.filter(exp => exp.experience_id !== experience_id));
            })
            .catch(error => console.error(error));
    };

    const handleDeleteEducation = (education_id) => {
        axios.delete(`http://localhost:8080/user/deleteEducation/${education_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            .then(() => {
                setEducation(education.filter(edu => edu.education_id !== education_id));
            })
            .catch(error => console.error(error));
    };

    const handleShowExpModal = (exp) => {
        setCurrentExp(exp ? { ...exp, start_date: exp.start_date || '', end_date: exp.end_date || '' } : {});
        setShowExpModal(true);
    };

    const handleShowEduModal = (edu) => {
        setCurrentEdu(edu ? { ...edu, start_date: edu.start_date || '', end_date: edu.end_date || '' } : {});
        setShowEduModal(true);
    };

    const addFriend = async () =>{
        axios.post(`http://localhost:8080/user/add_friend/${user_id}/${id}`, {},{ headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error initiating the friend request!", error);
            });
    };

    const cancelRequest = async () =>{
        axios.delete(`http://localhost:8080/user/cancel_request/${user_id}/${id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection({...connection,connection_status:''});
            })
            .catch(error => {
                console.error("There was an error cancelling the friend request!", error);
            });
    };

    const deleteFriend = async () =>{
        axios.delete(`http://localhost:8080/user/delete_friend/${user_id}/${id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection({...connection,connection_status:''});
            })
            .catch(error => {
                console.error("There was an error cancelling the friend request!", error);
            });
    };

    const deleteSpecificFriend = async (idparam) =>{
        axios.delete(`http://localhost:8080/user/delete_friend/${user_id}/${idparam}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection({...connection,connection_status:''});
            })
            .catch(error => {
                console.error("There was an error cancelling the friend request!", error);
            });
    };

    const acceptFriendRequest = async () =>{
        axios.put(`http://localhost:8080/user/accept_friend/${user_id}/${id}`,{}, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection(response.data);
            })
            .catch(error => {
                console.error("There was an error cancelling the friend request!", error);
            });
    };

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
        if(content.trim()!==''){
            await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            }).then(()=>{
                getPosts();
            }).catch((err) => {
                console.log(err);
            });
            handleCloseModal();
        }
        else alert('Post can\'t be empty.')

    };

    const rejectFriendRequest =async ()=>{
        axios.delete(`http://localhost:8080/user/reject_friend/${user_id}/${id}`, { headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` } })
            .then(response => {
                setConnection({...connection,connection_status:''});
            })
            .catch(error => {
                console.error("There was an error rejecting the friend request!", error);
            });
    };


    const renderFriendCard = (friend) => (
            <>
                <UserCard user={friend} />
            </>
    );

    const renderFollowingCard = (following) => (

        <CompanyCard company={following} />
    );



    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <UserImage
                                id={id}
                                size={'150px'}
                                trigger={trigger}
                            />

                            {user_id === id &&
                                <>
                                    <FontAwesomeIcon icon={faPlusCircle} size="lg" className="ml-2"
                                                     onClick={handleImageClick} style={{cursor: 'pointer'}}/>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{display: 'none'}}
                                        onChange={handleFileChange}
                                    />
                                </>
                            }


                            <Card.Title style={{marginLeft: "15px"}}>
                                {user.firstname + " " + user.lastname}
                                {
                                    user_id !== id &&

                                    <>
                                        <Button variant="success" onClick={toggleChatBox} style={{marginLeft: '10px'}}>
                                            Chat
                                        </Button>
                                    </>
                                }
                            </Card.Title>
                            {user_id !== id && connection && (
                                connection.connection_status === 'Pending' ? (
                                    connection.user1.id == user_id // == because they're not of the same type. one is string another is long/bigint
                                        ? (
                                            <Button variant="secondary" style={{marginLeft: '15px'}}
                                                    onClick={cancelRequest}>
                                                Cancel Friend Request
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="secondary" style={{marginLeft: '15px'}}
                                                        onClick={acceptFriendRequest}>
                                                    Accept Friend Request
                                                </Button>
                                                <Button variant="secondary" style={{marginLeft: '15px'}}
                                                        onClick={rejectFriendRequest}>
                                                    Reject Friend Request
                                                </Button>
                                            </>
                                        )

                                ) : connection.connection_status === 'Friends' ? (
                                    <Button variant="success" style={{marginLeft: '15px'}} onClick={deleteFriend}>
                                        Delete Friend
                                    </Button>
                                ) : (
                                    <Button variant="primary" type="submit" style={{marginLeft: '15px'}}
                                            onClick={addFriend}>
                                        Add Friend
                                    </Button>
                                )
                            )}

                            <Card.Text>{profile.headline}</Card.Text>
                            <Card.Text><small className="text-muted">{profile.industry}</small></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{marginTop: '15px', width: '250%'}}>
                        <Card.Body>
                            <Card.Title>About Me

                                {user_id === id &&
                                    <FontAwesomeIcon icon={faPencilAlt} className="ml-2" style={{cursor: 'pointer'}}
                                                     onClick={() => setShowAboutMeModal(true)}/>
                                }
                            </Card.Title>
                            <Card.Text>{profile.summary}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <hr/>

            <Row className="mt-4 d-flex flex-wrap align-items-stretch">
                <h4><strong style={{marginBottom:'40px'}}>Skills</strong></h4>
                {profile.skills.length>0 ? (profile.skills.map((skill) => (
                    <Col key={skill.skill_id} xs="auto" className="mb-3 d-flex" style={{marginRight: '10px'}}>
                        <Card
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: '3px solid #ddd',
                                height: '120px',  // Fixed height
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,     // Allow card to grow based on content
                                padding: '10px',
                                minWidth: '100px' // Minimum width for better appearance
                            }}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <Card.Text className="text-center mb-0">
                                    {skill.skill_name}
                                    {user_id === id && (
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="ml-2"
                                            style={{cursor: 'pointer', marginLeft: '20px'}}
                                            onClick={() => deleteSkill(skill.skill_id)}
                                        />
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))):(
                    <>
                        <h6 style={{marginBottom:'20px',marginTop:'20px'}}>Skills are empty.</h6>
                    </>
                )}

                {user_id === id && (
                    <Col xs="auto" className="mb-3 d-flex" style={{marginRight: '10px'}} >
                        <Card
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: '3px solid #ddd',
                                height: '120px',  // Fixed height
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexGrow: 1,     // Allow card to grow based on content
                                padding: '10px',
                                minWidth: '100px' // Minimum width for better appearance
                            }}
                            onClick={() => setShowSkillModal(true)}
                        >
                            <Card.Body>
                                <FontAwesomeIcon icon={faPlus} size="2x" className="text-muted"/>
                                <Card.Text className="text-center mt-2">Add Skill</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            <hr/>

            <Row className="mt-4">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Experience</Card.Title>
                            {user_id === id &&
                                <Button onClick={() => handleShowExpModal()}>Add Experience</Button>
                            }
                            {experiences.length > 0 ? experiences.map(exp => (

                                <div key={exp.experience_id}>
                                    <h5>{exp.title}
                                        {user_id === id &&

                                            <>
                                                <FontAwesomeIcon icon={faPencilAlt} className="ml-2"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => handleShowExpModal(exp)}/>
                                                <FontAwesomeIcon icon={faTrash} className="ml-2"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => handleDeleteExperience(exp.experience_id)}/>
                                            </>
                                        }
                                    </h5>
                                    <p>{exp.company_name}</p>
                                    <p>{exp.location}</p>
                                    <p>{new Date(exp.start_date).toLocaleDateString()} - {exp.end_date !== "" ? (new Date(exp.end_date).toLocaleDateString()) : ("now")}</p>
                                    <hr/>
                                </div>
                            )) : (<div><h5>No experiences added.</h5></div>)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Education</Card.Title>
                            {user_id === id &&
                                <Button onClick={() => handleShowEduModal()}>Add Education</Button>
                            }
                            {education.length > 0 ? education.map(edu => (
                                <div key={edu.education_id}>
                                    <h5>
                                        {edu.degree} in {edu.field_of_study}
                                        {user_id === id &&
                                            <>
                                                <FontAwesomeIcon icon={faPencilAlt} className="ml-2"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => handleShowEduModal(edu)}/>
                                                <FontAwesomeIcon icon={faTrash} className="ml-2"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => handleDeleteEducation(edu.education_id)}/>
                                            </>
                                        }

                                    </h5>
                                    <p>{edu.school_name}</p>
                                    <p>{new Date(edu.start_date).toLocaleDateString()} - {edu.end_date !== "" ? (new Date(edu.end_date).toLocaleDateString()) : ("now")}</p>
                                    <hr/>
                                </div>
                            )) : (<div><h5>No education added.</h5></div>)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <ButtonGroup className="mb-3" style={{marginTop: '20px'}}>
                <Button
                    className="custom-button"
                    variant={showType === 'Posts' ? "primary" : "outline-primary"}
                    onClick={() => setShowType('Posts')}
                >
                    Posts
                </Button>
                <Button
                    className="custom-button"
                    variant={showType === 'Friends' ? "primary" : "outline-primary"}
                    onClick={() => setShowType('Friends')}
                >
                    Friends
                </Button>
                <Button
                    className="custom-button"
                    variant={showType === 'Followings' ? "primary" : "outline-primary"}
                    onClick={() => setShowType('Followings')}
                >
                    Followings
                </Button>
            </ButtonGroup>
            <hr/>

            {showType === 'Posts' && (

                <>
                    {user_id === id &&
                        <Button variant="primary" onClick={handleShowModal}>New post</Button>
                    }

                    <Row className="mt-4">
                        <Col xs={12}>

                            <Post initialPostDtos={posts} fetchPosts={getPosts}/>
                        </Col>
                    </Row>
                </>

            )}
            {showType === 'Friends' && (
                <>
                    {friends.map(friend => renderFriendCard(friend))}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </>
            )}
            {showType === 'Followings' && (
                <>
                    {followings.map(following => renderFollowingCard(following))}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </>
            )}


            {/* ChatBox Component */}
            <ChatBox show={isChatOpen} handleClose={toggleChatBox} user_id={user_id} id={id}/>


            <Modal show={showExpModal} onHide={() => setShowExpModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentExp.experience_id ? 'Edit Experience' : 'Add Experience'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formExperienceTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" value={currentExp.title || ''}
                                          onChange={e => setCurrentExp({...currentExp, title: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formExperienceCompany">
                            <Form.Label>Company</Form.Label>
                            <Form.Control type="text" placeholder="Enter company" value={currentExp.company_name || ''}
                                          onChange={e => setCurrentExp({...currentExp, company_name: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formExperienceLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Enter location" value={currentExp.location || ''}
                                          onChange={e => setCurrentExp({...currentExp, location: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formExperienceStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter start date" value={currentExp.start_date || ''}
                                          onChange={e => setCurrentExp({...currentExp, start_date: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formExperienceEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter end date" value={currentExp.end_date || ''}
                                          onChange={e => setCurrentExp({...currentExp, end_date: e.target.value})}/>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExpModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveExperience}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEduModal} onHide={() => setShowEduModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentEdu.education_id ? 'Edit Education' : 'Add Education'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEducationDegree">
                            <Form.Label>Degree</Form.Label>
                            <Form.Control type="text" placeholder="Enter degree(Bachelor's, Master's etc.)"
                                          value={currentEdu.degree || ''}
                                          onChange={e => setCurrentEdu({...currentEdu, degree: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formEducationField">
                            <Form.Label>Field of Study</Form.Label>
                            <Form.Control type="text" placeholder="Enter field of study"
                                          value={currentEdu.field_of_study || ''} onChange={e => setCurrentEdu({
                                ...currentEdu,
                                field_of_study: e.target.value
                            })}/>
                        </Form.Group>
                        <Form.Group controlId="formEducationSchool">
                            <Form.Label>School Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter school name"
                                          value={currentEdu.school_name || ''}
                                          onChange={e => setCurrentEdu({...currentEdu, school_name: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formEducationStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter start date" value={currentEdu.start_date || ''}
                                          onChange={e => setCurrentEdu({...currentEdu, start_date: e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="formEducationEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter end date" value={currentEdu.end_date || ''}
                                          onChange={e => setCurrentEdu({...currentEdu, end_date: e.target.value})}/>
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEduModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveEducation}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* About Me Modal */}
            <Modal show={showAboutMeModal} onHide={handleCloseAboutMeModal}>
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
                                value={aboutMe}
                                onChange={handleAboutMeChange}
                                placeholder="Enter about me content"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAboutMeModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveAboutMe}>Save</Button>
                </Modal.Footer>
            </Modal>


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


            {/* Skill Modal */}
            <Modal show={showSkillModal} onHide={() => setShowSkillModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Skill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSkill">
                            <Form.Label>Skill Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a skill" value={newSkill}
                                          onChange={(e) => setNewSkill(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSkillModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddSkill}>
                        Add Skill
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default ProfilePage;