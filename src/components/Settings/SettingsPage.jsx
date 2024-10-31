import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Tab, Nav } from 'react-bootstrap';
import axios from "axios";

const SettingsPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [repeatPassword,setRepeatPassword]=useState('');
    const user_id=localStorage.getItem('user_id');

    const handlePut = (url,settingName,body) =>{
        // const res=
            axios.put(
                url,
                JSON.stringify(body),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        )
            .then(response => {
                if(response.status===200) alert('Updated successfully');
                if(settingName==='email') localStorage.setItem('auth_token',response.data);
            })
            .catch(error => {
                console.error("Error updating:", error);
            });

        // return res;
    };

    const validateEmail = (emailInput) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(emailInput).toLowerCase());
    };

    const validatePassword = (passwordInput) => {
        // Regular expression for strong password validation
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return re.test(passwordInput);
    };

    const handleSave = (settingName) => {
        // // Save the specific setting to the backend
        // console.log(`Saving ${settingName}`);
        switch (settingName){
            case 'email':
                if(validateEmail(email)){
                    handlePut(`http://localhost:8080/user/changeEmail/${user_id}`,'email',{email:email});
                }
                else alert('improper email address');
                setEmail('');
                return;
            case 'password':
                console.log('new pass:',password)
                if(password===repeatPassword && validatePassword(password)) handlePut(`http://localhost:8080/user/changePassword/${user_id}`,'password',{password:password});
                else {
                    if(password===repeatPassword) alert('Password not strong enough! Follow instructions!')
                    else alert('The passwords don\'t match!')
                }
                setPassword('');
                setRepeatPassword('');
                return;
            case 'firstName':
                if(firstName.trim()!=='')handlePut(`http://localhost:8080/user/changeFirstname/${user_id}`,'firstName',{firstName:firstName});
                else alert('input should not be empty')
                setFirstName('');
                return;
            case 'lastName':
                if(lastName.trim()!=='')handlePut(`http://localhost:8080/user/changeLastname/${user_id}`,'lastName',{lastName:lastName});
                else alert('input should not be empty')
                setLastName('');
                return;
            case 'location':
                if(location.trim()!=='')handlePut(`http://localhost:8080/user/changeLocation/${user_id}`,'location',{location:location});
                else alert('input should not be empty')
                setLocation('');
                return;
            default:
                return;
        }

    };

    return (
        <Container>
            <h2 className="my-4">Settings</h2>
            <Tab.Container defaultActiveKey="profile">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profile">Profile Settings</Nav.Link>
                            </Nav.Item>
                            {/*<Nav.Item>*/}
                            {/*    <Nav.Link eventKey="privacy">Privacy Settings</Nav.Link>*/}
                            {/*</Nav.Item>*/}
                            {/*<Nav.Item>*/}
                            {/*    <Nav.Link eventKey="account">Account Settings</Nav.Link>*/}
                            {/*</Nav.Item>*/}

                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="profile">
                                <h4>Profile Settings</h4>
                                <Form>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="primary" onClick={() => handleSave('email')}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Repeat password"
                                                    value={repeatPassword}
                                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="primary" onClick={() => handleSave('password')}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formFirstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="primary" onClick={() => handleSave('firstName')}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formLastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="primary" onClick={() => handleSave('lastName')}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formLocation">
                                        <Form.Label>Location</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Location"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="primary" onClick={() => handleSave('location')}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Form>
                                <br/>
                                <br/>
                                <br/>
                                <h5 style={{marginTop: '10px'}}>The password should have a length of at least 8
                                    characters and
                                    contain at least one small letter, one capital letter, one number and one special
                                    character.</h5>
                            </Tab.Pane>

                        </Tab.Content>

                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default SettingsPage;
