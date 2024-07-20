import {Card} from "react-bootstrap";
import React from "react";
import UserImage from "../Images/UserImage";
import {useNavigate} from "react-router-dom";

const UserCard=({user})=>{
    const navigate=useNavigate();

    const handleCardClick = (userparam) => {
        navigate(`/user/${userparam.id}`);
    };

    return (
        <div className="row">
            <div key={user.id} className="col-md-4 mb-4" onClick={() => handleCardClick(user)}>
                <Card className="search-card">
                    <div className="card-image-container"></div>
                    <Card.Body style={{cursor: 'pointer'}}>
                        <Card.Title>
                            <UserImage id={user.id} size={'40px'}/>
                            {user.firstname} {user.lastname}
                        </Card.Title>
                        {/*<Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>*/}
                        <Card.Text>Location: {user.location}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default UserCard;