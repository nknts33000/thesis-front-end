import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const JobSearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Simulating search results for demonstration
        const dummyResults = [
            { id: 1, title: 'Software Engineer', company: 'ABC Tech', location: 'New York, NY' },
            { id: 2, title: 'Marketing Manager', company: 'XYZ Corp', location: 'San Francisco, CA' },
            { id: 3, title: 'Data Analyst', company: '123 Inc', location: 'Chicago, IL' },
        ];
        setSearchResults(dummyResults);
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
                    <div key={job.id} className="col-md-4 mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{job.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
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
