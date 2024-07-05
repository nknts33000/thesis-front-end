import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import './applicants.css'; // Import the custom CSS

const ApplicantsPage = () => {
    const [resumes, setResumes] = useState([]);
    const { advertId } = useParams();
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getResumes/${advertId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setResumes(response.data);
            } catch (error) {
                console.error("Error fetching applicants", error);
            }
        };

        fetchApplicants();
    }, [advertId, token]);

    // Function to download resume
    const downloadResume = (filepath, filename) => {
        // Backend serves files from http://localhost:8080/uploads/
        const fullUrl = `http://localhost:8080/uploads/${filepath}`;

        axios({
            url: fullUrl,
            method: 'GET',
            responseType: 'blob', // Important to handle binary data
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            // Create a new Blob object using the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        }).catch((error) => {
            console.error("Error downloading resume", error);
        });
    };


    return (
        <Container>
            <h1>Applicants for Job ID: {advertId}</h1>
            {resumes.length === 0 ? (
                <p>No applicants found.</p>
            ) : (
                <Card>
                    <ListGroup variant="flush">
                        {resumes.map((resume) => (
                            <ListGroup.Item key={resume.id}>
                                <div className="list-group-container">
                                    <div className="left-column">
                                        <h5>{resume.user.fistname}{resume.user.lastname}</h5>
                                        {/*<p>Email: {resume.user.email}</p>*/}
                                        <Link to={`/user/${resume.user.id}`}>View Profile</Link>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="right-column">
                                        <h5>{resume.filename}</h5>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => downloadResume(resume.filepath, resume.filename)}
                                        >
                                            Download Resume
                                        </button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default ApplicantsPage;
