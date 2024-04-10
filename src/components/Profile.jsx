import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';

function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch profile data from backend API
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile'); // Adjust the API endpoint accordingly
                setProfile(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
                <Row>
                    <Col md={3}>
                        <Image src={profile.profilePicture} rounded fluid />
                    </Col>
                    <Col md={9}>
                        <h2>{profile.headline}</h2>
                        <p>{profile.summary}</p>
                        <p>Industry: {profile.industry}</p>
                    </Col>
                </Row>

        </Container>
    );
}

export default UserProfile;
