import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";

const CreateAdvertPage = () => {
    const location = useLocation();
    const  {company}  = location.state ||  {company: null };
    const [newAdvert, setNewAdvert] = useState({
        jobTitle: '',
        jobSummary: '',
        location: '',
        contactInformation: '',
        company: company.companyId
    });
    const navigate = useNavigate();

    console.log(newAdvert)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdvert(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // const handleCompanyChange = (e) => {
    //     const selectedCompanyName = e.target.value;
    //     const selectedCompany = companies.find(company => company.name === selectedCompanyName);
    //     console.log(selectedCompany.companyId)
    //     //if(selectedCompany===null) console.log('null')
    //     setNewAdvert(prevState => ({
    //         ...prevState,
    //         company: selectedCompany ? selectedCompany.companyId : ''
    //     }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newAdvert);
        try {

            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const response = await fetch('http://localhost:8080/user/createAdvert', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newAdvert)
            });


            if (response.ok) {

                console.log('Advert created successfully:', response);
                navigate('/companies'); // Navigate back to companies page
            } else {
                console.log('Failed to create advert:', response);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (

        <Container>
            <h2>Create New Job Advertisement {company && `for ${company.name}`}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formJobTitle">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control type="text" name="jobTitle" value={newAdvert.jobTitle} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formJobSummary">
                    <Form.Label>Job Summary</Form.Label>
                    <Form.Control as="textarea" name="jobSummary" value={newAdvert.jobSummary} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={newAdvert.location} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formContactInformation">
                    <Form.Label>Contact Information</Form.Label>
                    <Form.Control type="text" name="contactInformation" value={newAdvert.contactInformation} onChange={handleInputChange} required />
                </Form.Group>
                {/*<Form.Group controlId="formCompany">*/}
                {/*    <Form.Label>Company</Form.Label>*/}
                {/*    <Form.Control as="select" name="company" onChange={handleCompanyChange} required>*/}
                {/*        {companies.map((company) => (*/}
                {/*            <option key={company.companyId} value={company.name}>{company.name}</option>*/}
                {/*        ))}*/}
                {/*    </Form.Control>*/}
                {/*</Form.Group>*/}
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default CreateAdvertPage;

