import React, {useEffect} from 'react';
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const navigate=useNavigate();

    useEffect(()=>{
        const token=localStorage.getItem('auth_token');
        if(token===null || token==='null'){
            navigate('/login');
        }
    })


    return (
        <Container>
            <Row className="mt-4">
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <Image src="https://via.placeholder.com/150" roundedCircle className="mb-3" />
                            <Card.Title>John Doe</Card.Title>
                            <Card.Text>Software Engineer</Card.Text>
                            <Button variant="primary">Connect</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12} md={12}> {/* Adjusted column size to cover the full width on smaller screens */}
                    <Card>
                        <Card.Body>
                            <Card.Title>About Me</Card.Title>
                            <Card.Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum nisi vel massa vehicula,
                                et faucibus mi venenatis. Vestibulum condimentum consectetur enim, nec commodo ipsum auctor et. Nulla
                                facilisi. Curabitur rutrum, turpis a varius tristique, elit eros convallis felis, sit amet volutpat
                                urna nulla eget odio. Integer convallis ut libero at auctor. Vivamus sollicitudin convallis eros nec
                                gravida.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};

export default ProfilePage;
