import React, {useEffect, useState} from 'react';
import {Row, Col, Container, Nav, Navbar, Tab, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import './CompaniesPage.css'


const CompanyPage = ({ companyName, mission, companyLogo }) => {
    const [activeTab, setActiveTab] = useState('about');
    const navigate= useNavigate();
    const [companies,setCompanies] = useState([]);

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
        navigate('/createCompany')
    }

    return (
        <>
            <Button variant="primary" onClick={newComp} style={{'margin-top':'20px','margin-bottom':'80px'}}>New Company</Button>
            {companies.length>0 ? (companies.map((company) => (
                    <Container>
                        <Row className="mb-3">
                            <Col xs={12} md={10}>
                                <img src={companyLogo} alt="Company Logo"/>
                                <h1 className="company-name">{company.name}</h1>
                            </Col>
                        </Row>

                        <Navbar bg="light" expand="lg">
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <Nav.Link onClick={() => setActiveTab('about')} active={activeTab === 'about'}>About</Nav.Link>
                                    <Nav.Link onClick={() => setActiveTab('posts')} active={activeTab === 'posts'}>Posts</Nav.Link>
                                    <Nav.Link onClick={() => setActiveTab('jobs')} active={activeTab === 'jobs'}>Jobs</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>

                        <Tab.Content>
                            <Tab.Pane eventKey="about" active={activeTab === 'about'}>
                                <div className="horizontal-container"><h2 style={{'margin-right':'10px'}}>About</h2><h2 className="company-name" style={{'margin-bottom':'4px'}}> {company.name}</h2></div>
                                <p><strong>Mission:</strong> {company.mission}</p>

                            </Tab.Pane>
                            <Tab.Pane eventKey="posts" active={activeTab === 'posts'}>
                                {/* Add your posts component here */}
                                <h2>Posts</h2>
                                {/* Example: <PostsComponent /> */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="jobs" active={activeTab === 'jobs'}>
                                {/* Add your jobs component here */}
                                <h2>Jobs</h2>
                                {/* Example: <JobsComponent /> */}
                            </Tab.Pane>
                        </Tab.Content>
                    </Container>
                )
            )) : (<div className="mt-3">No companies yet.</div>)}

        </>
    );
};

export default CompanyPage;