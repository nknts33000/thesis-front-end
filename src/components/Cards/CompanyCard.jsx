import {Card} from "react-bootstrap";
import UserImage from "../Images/UserImage";
import CompanyImage from "../Images/CompanyImage";
import React from "react";
import {useNavigate} from "react-router-dom";

const CompanyCard=({company})=>{
    const navigate=useNavigate();

    const handleCardClick = (companyparam) => {
        navigate(`/company/${companyparam.companyId}`);
    };

    return (
        <div className="row">
            <div key={company.companyId} className="col-md-4 mb-4" onClick={() => handleCardClick(company)}>
                <Card className="search-card">
                    <div className="card-image-container"></div>
                    <Card.Body style={{cursor: 'pointer'}}>
                        <Card.Title>
                            <CompanyImage companyId={company.companyId} size={'40px'} />
                            <Card.Text style={{marginBottom:'7px'}}>{company.name}</Card.Text>
                        </Card.Title>
                        <Card.Text>{company.mission}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );

};

export default CompanyCard;