import React, {useEffect, useState} from 'react';
import { Container, Form, Button, Card, ButtonGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';
import UserImage from "../Images/UserImage";
import CompanyImage from "../Images/CompanyImage"; // Import the custom CSS file

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('users'); // Default search type
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();
    const [recommendedUsers,setRecommendedUsers]=useState([]);
    const user_id=localStorage.getItem('user_id');

    useEffect(() => {
        getRecommendedUsers();
    }, [user_id]);

    const handleSearch = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        try {
            const endpoint = searchType === 'users'
                ? `http://localhost:8080/user/searchUsers/${searchQuery}`
                : `http://localhost:8080/user/searchCompanies/${searchQuery}`;

            const response = await axios.get(endpoint, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("There was an error searching!", error);
        }
    };

    const emptyResults = () => {
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleCardClick = (result) => {
        if(searchType === 'users') navigate(`/user/${result.id}`);
        else navigate(`/company/${result.companyId}`);
    };

    const getRecommendedUsers = async () =>{
        await axios.get(`http://localhost:8080/user/getRecommendedUsers/${user_id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        }).then(
            (response)=>{
                setRecommendedUsers(response.data);
            }
        ).catch((error)=>{
            console.log(error);
        });
    };

    return (
        <Container>
            <h1>Search for {searchType === 'users' ? 'Users' : 'Companies'}</h1>
            <p>Find the {searchType === 'users' ? 'people' : 'companies'} you're looking for</p>

            <ButtonGroup className="mb-3" onClick={emptyResults}>
                <Button
                    className="custom-button"
                    variant={searchType === 'users' ? "primary" : "outline-primary"}
                    onClick={() => setSearchType('users')}
                >
                    Users
                </Button>
                <Button
                    className="custom-button"
                    variant={searchType === 'companies' ? "primary" : "outline-primary"}
                    onClick={() => setSearchType('companies')}
                >
                    Companies
                </Button>
            </ButtonGroup>

            <Form onSubmit={handleSearch}>
                <Form.Group controlId="searchQuery">
                    <Form.Label>
                        Enter a {searchType === 'users' ? 'username or skill' : 'company name or industry'}:
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={searchType === 'users' ? "E.g., John Doe, React Developer" : "E.g., TechCorp, Marketing"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Search
                </Button>
            </Form>

            {searchType==='users'&&

                <>
                    <hr/>
                    <div className="row">
                        {recommendedUsers.length > 0 ? (
                            recommendedUsers.map((result, index) => (
                                <div key={index} className="col-md-4 mb-4" onClick={() => handleCardClick(result)}>
                                    <Card className="search-card">
                                        <div className="card-image-container"></div>
                                        <Card.Body style={{cursor: 'pointer'}}>
                                            <Card.Title>
                                                <UserImage id={result.id} size={'40px'}/>
                                                {result.firstname} {result.lastname}
                                            </Card.Title>
                                            <Card.Subtitle
                                                className="mb-2 text-muted">{result.email}</Card.Subtitle>
                                            <Card.Text>Location: {result.location}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <h6>No recommended users found. Be sure to fill your profile with information so we can find you users with similar interests.</h6>
                        )}
                    </div>
                </>
            }
            <hr/>

            <h2>Search Results</h2>
            <div className="row">
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div key={index} className="col-md-4 mb-4" onClick={() => handleCardClick(result)}>
                            <Card className="search-card">
                                <div className="card-image-container"></div>
                                <Card.Body style={{cursor: 'pointer'}}>
                                    {searchType === 'users' ? (
                                        <>
                                            <Card.Title>
                                                <UserImage id={result.id} size={'40px'}/>
                                                {result.firstname} {result.lastname}
                                            </Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{result.email}</Card.Subtitle>
                                            <Card.Text>Location: {result.location}</Card.Text>
                                        </>
                                    ) : (
                                        <>
                                            <CompanyImage companyId={result.companyId} size={'40px'}/>
                                            <Card.Title>{result.name}</Card.Title>
                                            <Card.Text>{result.mission}</Card.Text>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </Container>
    );
};

export default SearchPage;
