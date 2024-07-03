import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Button, Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from "axios";

const JobAdvertisementPage = () => {
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [logo, setLogo] = useState(null);
    const { advertId, companyId } = useParams();
    const token = localStorage.getItem('auth_token');
    const [owner,setOwner]=useState(null);
    const  user_id=localStorage.getItem('user_id');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getAdvert/${advertId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setJob(response.data);
            } catch (error) {
                console.error("There was an error fetching the job advertisement!", error);
            }
        };

        const getCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getCompany/${companyId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setCompany(response.data);
            } catch (error) {
                console.error("There was an error fetching the company!", error);
            }
        };

        const fetchCompanyLogo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getCompanyLogo/${companyId}`, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setLogo(imageUrl);
            } catch (error) {
                console.error("Error fetching company logo", error);
            }
        };

        const fetchOwner =async ()=>{
            try {
                const response = await axios.get(`http://localhost:8080/user/getOwner/${companyId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setOwner(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("There was an error fetching the owner!", error);
            }
        };

        getCompany();
        fetchJob();
        fetchCompanyLogo();
        fetchOwner();
    }, [advertId, companyId, token]);

    const handleResumeSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("resume", e.target.resume.files[0]);

        try {
            await axios.post(`http://localhost:8080/user/submitResume/${advertId}/${user_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Resume submitted successfully!');
        } catch (error) {
            console.error("There was an error submitting the resume!", error);
            alert('Failed to submit resume.');
        }
    };

    if (!job) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            {company && (
                <>
                    <Image
                        src={logo || 'placeholder.jpg'}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <h3>{company.name}</h3>
                    <hr />
                </>
            )}

            <h1>{job.jobTitle}</h1>
            <Card>
                <Card.Body>
                    <Card.Title>Summary</Card.Title>
                    <Card.Text>{job.jobSummary}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Location</Card.Title>
                    <Card.Text>{job.location}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Contact Information</Card.Title>
                    <Card.Text>{job.contactInformation}</Card.Text>
                </Card.Body>
            </Card>

            {/* Form for submitting resume */}
            {
                owner && (
                        owner.id==user_id?(
                                        <Button variant="primary" type="submit">
                                            View applicants
                                        </Button>
                            ):(
                                <>
                                    <Form onSubmit={handleResumeSubmit}>
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>Submit Your Resume</Form.Label>
                                            <Form.Control type="file" name="resume" accept=".pdf" required />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Submit Resume
                                        </Button>
                                    </Form>
                                </>
                            )
                )
            }
        </Container>

    );
};

export default JobAdvertisementPage;
