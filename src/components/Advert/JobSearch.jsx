import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const JobSearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const token=localStorage.getItem('auth_token')
    const navigate = useNavigate();
    const handleSearch = async (event) => {
        setSearchResults([]);
        event.preventDefault(); // Prevent the default form submission
        try {
            const response = await axios.get(`http://localhost:8080/user/searchAdverts/${searchQuery}`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("There was an error searching!", error);
        }
    };

    // const getCompanyOfAdvert = async(advertId) =>
    // {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/user/getCompanyOfAdvert/${advertId}`, {
    //             headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    //         });
    //         return response.data;
    //         //console.log(response.data);
    //     } catch (error) {
    //         console.error("There was an error getting the company of advert!", error);
    //     }
    // };

    const toJobPage = async(advertId) =>{
        try {
            const response = await axios.get(`http://localhost:8080/user/getCompanyOfAdvert/${advertId}`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            navigate(`/advert/${response.data.companyId}/${advertId}`)
            //console.log(response.data);
        } catch (error) {
            console.error("There was an error getting the company of advert!", error);
        }

    };

    return (
        <Container>
            <h1>Find Your Dream Job</h1>
            <p>Search for any job of your liking</p>

            <Form onSubmit={handleSearch}>
                <Form.Group controlId="searchQuery">
                    <Form.Label>Enter a job title, keyword, or company name:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="E.g., Software Engineer, Marketing Manager"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Search
                </Button>
            </Form>

            <hr />

            <h2>Search Results</h2>
            <div className="row">
                {searchResults.map((job) => (
                    <div key={job.advertId} className="col-md-4 mb-4">
                        <Card>
                            <Card.Body style={{cursor:'pointer'}} onClick={()=>toJobPage(job.advertId)}>
                                <Card.Title>{job.jobTitle}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                                <Card.Text>{job.jobSummary}</Card.Text>
                                <Card.Text>{job.location}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default JobSearchPage;
