import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const CreateCompanyPage = () => {
    const [companyName, setCompanyName] = useState('');
    const [mission, setMission] = useState('');
    const navigate=useNavigate();
    const handleSubmit = async(e) => {
        try {
            e.preventDefault();
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response=await fetch('http://localhost:8080/user/createCompany', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({token: token, mission: mission, name: companyName})
            });

            if (response.ok) navigate('/companies')
            else console.log(response)
        }
        catch (e) {
            console.log(e);
        }

    };

    return (
        <Container>
            <h1>Create a New Company</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="mission">
                    <Form.Label>Mission</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter company mission"
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Company
                </Button>
            </Form>
        </Container>
    );
};

export default CreateCompanyPage;
