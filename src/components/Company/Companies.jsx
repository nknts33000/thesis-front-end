import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Nav, Navbar, Tab, Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './CompaniesPage.css'
import CompanyCard from "../Cards/CompanyCard";

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
                                {/*<h1 className="company-name">{company.name}</h1>*/}
                                <CompanyCard company={company} />
                                <Button variant="primary" onClick={() => {
                                    navigate(`/company/${company.companyId}`)
                                }}>Go to page</Button>
                            </Col>
                        </Row>

                    </Container>
                ))
            ) : (<div className="mt-3">No companies yet.</div>)}
        </>
    );
};

export default CompaniesPage;
