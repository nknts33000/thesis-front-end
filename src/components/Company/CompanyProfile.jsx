import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Image } from 'react-bootstrap';
import axios from 'axios';

const CompanyProfile = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/companies/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompany(response.data);
            } catch (error) {
                console.error("There was an error fetching the company data!", error);
            }
        };

        fetchCompany();
    }, [companyId, token]);

    if (!company) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>{company.name}</Card.Title>
                    <Image
                        src={company.companyLogo ? company.companyLogo : ""}
                        roundedCircle
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover'
                        }}
                        alt={`${company.name} Logo`}
                        className="card-image"
                    />
                    <Card.Text>Mission: {company.mission}</Card.Text>
                    {/* Add more fields as needed */}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CompanyProfile;
