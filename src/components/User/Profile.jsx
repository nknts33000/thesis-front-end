import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [showExpModal, setShowExpModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    const [currentExp, setCurrentExp] = useState({});
    const [currentEdu, setCurrentEdu] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token === null || token === 'null') {
            navigate('/login');
        } else {
            axios.get(`http://localhost:8080/user/getUser/${token}`, { headers:
                    { "Content-Type": "application/json", Authorization: `Bearer ${token}` } })
                .then(response => {
                    setUser(response.data);
                    console.log(response.data)
                    setProfile(response.data.profile);
                    setEducation(response.data.education);
                    setExperiences(response.data.experiences);
                    console.log(response.data.experiences)
                })
                .catch(error => {
                    console.error("There was an error fetching the profile!", error);
                });
        }
    }, [navigate]);

    const handleSaveExperience = () => {
        if (currentExp.experience_id) {
            axios.put(`http://localhost:8080/experience/${currentExp.experience_id}`,{headers:{
                "content-type":"application/json",Authorization: `Bearer ${localStorage.getItem('auth_token')}`}},
                currentExp)
                .then(response => {
                    setExperiences(experiences.map(exp => exp.experience_id === currentExp.experience_id ? response.data : exp));
                    setShowExpModal(false);
                })
                .catch(error => console.error(error));
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
                    setExperiences([...experiences, response.data]);
                    setShowExpModal(false);
                })
                .catch(error => console.error(error));
        }
    };

    const handleSaveEducation = () => {
        if (currentEdu.education_id) {
            axios.put(`http://localhost:8080/education/${currentEdu.education_id}`, currentEdu)
                .then(response => {
                    setEducation(education.map(edu => edu.education_id === currentEdu.education_id ? response.data : edu));
                    setShowEduModal(false);
                })
                .catch(error => console.error(error));
        } else {
            axios.post(`http://localhost:8080/education`, currentEdu)
                .then(response => {
                    setEducation([...education, response.data]);
                    setShowEduModal(false);
                })
                .catch(error => console.error(error));
        }
    };

    const handleDeleteExperience = (experience_id) => {
        axios.delete(`http://localhost:8080/experience/${experience_id}`)
            .then(() => {
                setExperiences(experiences.filter(exp => exp.experience_id !== experience_id));
            })
            .catch(error => console.error(error));
    };

    const handleDeleteEducation = (education_id) => {
        axios.delete(`http://localhost:8080/education/${education_id}`)
            .then(() => {
                setEducation(education.filter(edu => edu.education_id !== education_id));
            })
            .catch(error => console.error(error));
    };

    const handleShowExpModal = (exp) => {
        setCurrentExp(exp || {});
        setShowExpModal(true);
    };

    const handleShowEduModal = (edu) => {
        setCurrentEdu(edu || {});
        setShowEduModal(true);
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <Image src={profile.picture_url || "https://via.placeholder.com/150"} roundedCircle className="mb-3" />
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Text>{profile.headline}</Card.Text>
                            <Card.Text><small className="text-muted">{profile.industry}</small></Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>About Me</Card.Title>
                            <Card.Text>{profile.summary}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Experience</Card.Title>
                            <Button onClick={() => handleShowExpModal()}>Add Experience</Button>
                            {experiences.length > 0 ? experiences.map(exp => (
                                <div key={exp.experience_id}>
                                    <h5>{exp.title}</h5>
                                    <p>{exp.company_name}</p>
                                    <p>{exp.location}</p>
                                    <p>{new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}</p>
                                    <Button variant="secondary" onClick={() => handleShowExpModal(exp)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteExperience(exp.experience_id)}>Delete</Button>
                                    <hr />
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
                            <Button onClick={() => handleShowEduModal()}>Add Education</Button>
                            {education.length > 0 ? education.map(edu => (
                                <div key={edu.education_id}>
                                    <h5>{edu.degree} in {edu.field_of_study}</h5>
                                    <p>{edu.school_name}</p>
                                    <p>{new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()}</p>
                                    <Button variant="secondary" onClick={() => handleShowEduModal(edu)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteEducation(edu.education_id)}>Delete</Button>
                                    <hr />
                                </div>
                            )) : (<div><h5>No education added.</h5></div>)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showExpModal} onHide={() => setShowExpModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentExp.experience_id ? 'Edit Experience' : 'Add Experience'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formExperienceTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" value={currentExp.title || ''} onChange={e => setCurrentExp({ ...currentExp, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formExperienceCompany">
                            <Form.Label>Company</Form.Label>
                            <Form.Control type="text" placeholder="Enter company" value={currentExp.company_name || ''} onChange={e => setCurrentExp({ ...currentExp, company_name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formExperienceLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Enter location" value={currentExp.location || ''} onChange={e => setCurrentExp({ ...currentExp, location: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formExperienceStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter start date" value={currentExp.start_date || ''} onChange={e => setCurrentExp({ ...currentExp, start_date: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formExperienceEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter end date" value={currentExp.end_date || ''} onChange={e => setCurrentExp({ ...currentExp, end_date: e.target.value })} />
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
                            <Form.Control type="text" placeholder="Enter degree" value={currentEdu.degree || ''} onChange={e => setCurrentEdu({ ...currentEdu, degree: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formEducationField">
                            <Form.Label>Field of Study</Form.Label>
                            <Form.Control type="text" placeholder="Enter field of study" value={currentEdu.field_of_study || ''} onChange={e => setCurrentEdu({ ...currentEdu, field_of_study: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formEducationSchool">
                            <Form.Label>School Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter school name" value={currentEdu.school_name || ''} onChange={e => setCurrentEdu({ ...currentEdu, school_name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formEducationStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter start date" value={new Date(currentEdu.start_date).toLocaleDateString() || ''} onChange={e => setCurrentEdu({ ...currentEdu, start_date: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formEducationEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter end date" value={currentEdu.end_date || ''} onChange={e => setCurrentEdu({ ...currentEdu, end_date: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEduModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveEducation}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProfilePage;

