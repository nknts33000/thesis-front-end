// Login.js
import React, { useState } from 'react';
import {Container, Form, Button, Row, Col, Modal} from 'react-bootstrap';


// export const getAuthToken = () => {
//     return window.localStorage.getItem('auth_token');
// };
//
// export const setAuthHeader = (token) => {
//     if (token !== null) {
//         window.localStorage.setItem("auth_token", token);
//     } else {
//         window.localStorage.removeItem("auth_token");
//     }
// };

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [modalMessage,setModalMessage]=useState('');
    const [modalHeader,setModalHeader]=useState('');
    const handleModalShow = (message,header) => {
        setModalMessage(message);
        setModalHeader(header);
        setShow(true);

    };
    const userforlogin={email,password}

    const handleModalClose = () => setShow(false);

    // const performlogin= async ()=>
    // {
    //     await fetch('http://localhost:8080/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //
    //         },
    //         body: JSON.stringify(userforlogin)
    //
    //     })
    //         .then(
    //             (res) => {
    //                 if(res.status ===200){
    //                     const user =res.json();
    //                     const token=user.token;
    //                     console.log("token: " +token)
    //                     localStorage.setItem('auth_token', token);
    //                     handleModalShow(token,"Token is:")
    //                 }
    //                 else{
    //                     handleModalShow("Your email or password is wrong.","Wrong credentials")
    //                 }
    //
    //             }
    //
    //         )
    //         .catch(err =>
    //             {
    //                 handleModalShow(err,"An error has occurred.")
    //             }
    //         );
    //     //setAuthHeader(user.token);
    //
    //
    //
    //
    // }


    const performlogin = async () => {
        try {
            await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userforlogin)
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json(); // Make sure to await this
                    } else {
                        throw new Error("Invalid credentials.Your email or password is wrong.");
                    }
                })
                .then((data) => {
                    const token = data.token;
                    localStorage.setItem('auth_token', token);
                    handleModalShow("", "Successful login");
                })
                .catch((err) => {
                    handleModalShow(err.message, "An error has occurred.");
                });
        } catch (error) {
            handleModalShow(error.message, "An error has occurred.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        performlogin();
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2 className="mb-4">Register</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="emailid">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                          onChange={(e) =>
                                              setEmail(e.target.value)
                                          } />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password"
                                          onChange={(e) =>
                                              setPassword(e.target.value)
                                          }/>
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Register
                        </Button>
                    </Form>
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

export default Login;
