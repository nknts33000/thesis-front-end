import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Nav, Navbar, Tab, Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './CompaniesPage.css'

const CompaniesPage = () => {
    const [activeTab, setActiveTab] = useState('about');

    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const response = await fetch(`http://localhost:8080/user/getCompanies/${token}`, {
                    method: 'GET',
                    headers: headers
                });

                if (response.ok) {
                    const data = await response.json(); // Assuming the response is JSON
                    setCompanies(data);
                    console.log(data);
                } else {
                    console.log(response);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchCompanies();
    }, []);

    const newComp = () => {
        navigate('/createCompany');
    };

    return (
        <>
            <Button variant="primary" onClick={newComp} style={{marginTop: '40px',marginBottom:'15px'}}>New
                Company</Button>
            <h2><strong>My companies</strong></h2>
            <hr/>
            {companies.length > 0 ? (
                companies.map((company) => (
                    <Container key={company.companyId}>
                        <Row className="mb-3">
                            <Col xs={12} md={10}>
                                {/*<img src={company.companyLogo} alt="Company Logo" />*/}
                                <h1 className="company-name">{company.name}</h1>
                                <Button variant="primary" onClick={() => {
                                    navigate(`/company/${company.companyId}`)
                                }}>Go to page</Button>
                            </Col>
                        </Row>

                        {/*<Navbar bg="light" expand="lg">*/}
                        {/*    <Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
                        {/*    <Navbar.Collapse id="basic-navbar-nav">*/}
                        {/*        <Nav className="mr-auto">*/}
                        {/*            <Nav.Link onClick={() => setActiveTab('about')} active={activeTab === 'about'}>About</Nav.Link>*/}
                        {/*            <Nav.Link onClick={() => setActiveTab('posts')} active={activeTab === 'posts'}>Posts</Nav.Link>*/}
                        {/*            <Nav.Link onClick={() => setActiveTab('jobs')} active={activeTab === 'jobs'}>Jobs</Nav.Link>*/}
                        {/*        </Nav>*/}
                        {/*    </Navbar.Collapse>*/}
                        {/*</Navbar>*/}

                        {/*<Tab.Content>*/}
                        {/*    <Tab.Pane eventKey="about" active={activeTab === 'about'}>*/}
                        {/*        <div className="horizontal-container">*/}
                        {/*            <h2 style={{ marginRight: '10px' }}>About</h2>*/}
                        {/*            <h2 className="company-name" style={{ marginBottom: '4px' }}>{company.name}</h2>*/}
                        {/*        </div>*/}
                        {/*        <p><strong>Mission:</strong> {company.mission}</p>*/}
                        {/*    </Tab.Pane>*/}
                        {/*    <Tab.Pane eventKey="posts" active={activeTab === 'posts'}>*/}
                        {/*        <h2>Posts</h2>*/}
                        {/*    </Tab.Pane>*/}
                        {/*    <Tab.Pane eventKey="jobs" active={activeTab === 'jobs'}>*/}
                        {/*        <h2>Jobs</h2>*/}
                        {/*        /!*<Button variant="success" onClick={createAdvert(company)} style={{ marginBottom: '20px' }}>Create Job</Button>*!/*/}
                        {/*        <Button variant="success" onClick={*/}
                        {/*            ()=>{*/}
                        {/*            navigate('/createAdvert', { state: { company } });*/}
                        {/*        }} style={{ marginBottom: '20px' }}>Create Job</Button>*/}
                        {/*        /!* Display brief advertisement information *!/*/}
                        {/*        {company.adverts && company.adverts.map((advert) => (*/}
                        {/*            <Card key={advert.advertId} className="mb-3">*/}
                        {/*                <Card.Body>*/}
                        {/*                    <Card.Title>{advert.jobTitle}</Card.Title>*/}
                        {/*                    <Card.Text>*/}
                        {/*                        {advert.jobSummary}*/}
                        {/*                    </Card.Text>*/}
                        {/*                    <Button variant="primary">View Details</Button>*/}
                        {/*                </Card.Body>*/}
                        {/*            </Card>*/}
                        {/*        ))}*/}
                        {/*    </Tab.Pane>*/}
                        {/*</Tab.Content>*/}
                    </Container>
                ))
            ) : (<div className="mt-3">No companies yet.</div>)}
        </>
    );
};

export default CompaniesPage;
