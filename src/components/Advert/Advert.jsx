import React from 'react';
import { Container, Card } from 'react-bootstrap';

const JobAdvertisementPage = ({ jobTitle, jobSummary, keyResponsibilities, qualifications, location, salaryAndBenefits, howToApply, contactInformation }) => {
    return (
        <Container>
            <h1>{jobTitle}</h1>
            <Card>
                <Card.Body>
                    <Card.Title>Summary</Card.Title>
                    <Card.Text>{jobSummary}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Key Responsibilities</Card.Title>
                    <Card.Text>{keyResponsibilities}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Qualifications</Card.Title>
                    <Card.Text>{qualifications}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Location</Card.Title>
                    <Card.Text>{location}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Salary and Benefits</Card.Title>
                    <Card.Text>{salaryAndBenefits}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>How to Apply</Card.Title>
                    <Card.Text>{howToApply}</Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Contact Information</Card.Title>
                    <Card.Text>{contactInformation}</Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default JobAdvertisementPage;
