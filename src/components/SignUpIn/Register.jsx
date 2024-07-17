import React, { useState } from 'react';
import { Container, Form, Button, Row, Col,Modal } from 'react-bootstrap';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatpassword, setRepeatpassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [location, setLocation] = useState('');
    const [show, setShow] = useState(false);
    const [modalMessage,setModalMessage]=useState('');
    const [modalHeader,setModalHeader]=useState('');
    const handleModalShow = (message,header) => {
        setModalMessage(message);
        setModalHeader(header);
        setShow(true);

    };

    const handleModalClose = () => setShow(false);

    const registerdto={email,password,firstname,lastname,location}

    const validateEmail = (emailInput) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(emailInput).toLowerCase());
    };

    const validatePassword = (passwordInput) => {
        // Regular expression for strong password validation
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return re.test(passwordInput);
    };

    const register = async () =>{

        await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerdto)

        })
        .then(
            res => {
                handleModalShow("Registration is Complete! Head to the login page to Sign in!","Registered successfully!")
            }

        )
        .catch(err =>
            {
                handleModalShow(err,"An error has occurred.")
            }
        );
    };

    const handleSubmit= (e) => {
        e.preventDefault();
        if(password === repeatpassword){
            if(email && password && repeatpassword && firstname && lastname){
                if(validateEmail(email)){
                    if(validatePassword(password)) register();
                    else handleModalShow('The password isn\'t strong enough.')
                }
                else handleModalShow('The email doesn\'t have a proper form.')
            }
            else{
                handleModalShow('Please fill all the mandatory fields')
            }

        }
        else{
            handleModalShow("Please re-enter both passwords to make sure they match.","Passwords don't match");
        }

    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2 className="mb-4">Register</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="firstname">
                            <Form.Label>First name*</Form.Label>
                            <Form.Control type="text" placeholder="Enter your first name"
                                          onChange={(e) =>
                                              setFirstname(e.target.value.trim())
                                          }/>
                        </Form.Group>

                        <Form.Group controlId="lastname">
                            <Form.Label>Last name*</Form.Label>
                            <Form.Control type="text" placeholder="Enter your last name"
                                          onChange={(e) =>
                                              setLastname(e.target.value.trim())
                                          }/>
                        </Form.Group>

                        <Form.Group controlId="emailid">
                            <Form.Label>Email address*</Form.Label>
                            <Form.Control type="email" placeholder="Enter email(must not be used in another account)"
                                          onChange={(e) =>
                                              setEmail(e.target.value.trim())
                                          }/>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password*</Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                          onChange={(e) =>
                                              setPassword(e.target.value.trim())
                                          }/>
                        </Form.Group>

                        <Form.Group controlId="repeatpassword">
                            <Form.Label>Password*</Form.Label>
                            <Form.Control type="password" placeholder="Repeat password"
                                          onChange={(e) =>
                                              setRepeatpassword(e.target.value.trim())
                                          }/>
                        </Form.Group>

                        <Form.Group controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Enter your location(optional)"
                                          onChange={(e) =>
                                              setLocation(e.target.value.trim())
                                          }/>
                        </Form.Group>


                        <Button variant="primary" type="submit">
                            Register
                        </Button>

                    </Form>
                    <h5 style={{marginTop: '60px'}}>-The fields that contain "*" are mandatory.</h5>
                    <h5 style={{marginTop: '10px'}}>-The password should have a length of at least 8 characters and contain at least one small letter, one capital letter, one number and one special character.</h5>
                </Col>
            </Row>


            <Modal show={show} onHide={handleModalClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleModalClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Register;
