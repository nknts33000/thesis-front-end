import React, {useEffect, useState} from 'react';
import { Navbar, Nav, Container, Button, Modal, NavItem } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/SignUpIn/Register';
import Login from './components/SignUpIn/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./components/User/LandingPage";
import Profile from "./components/User/Profile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage, faUserFriends, faCaretDown, faBriefcase} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


function App() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

function Main() {

    const navigate = useNavigate();
    const [friendListModal, setFriendListModal] = useState(false);

    const[messageModal,setMessageModal]=useState(false);

    const handleShowFriendListModal = () => setFriendListModal(true);
    const handleCloseFriendListModal = () => setFriendListModal(false);
    const showMessageModal = () => setMessageModal(true);
    const closeMessageModal = () => setMessageModal(false);


    // useEffect(() => {
    //     console.log(localStorage.getItem('auth_token'))
    // }, []);

    const handleLogout = async () => {

        // const url = 'http://localhost:8080/logout';
        // const token = localStorage.getItem('auth_token');
        //
        // try {
        //     const response = await axios.post(url, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}` // Send token in a more standard way
        //         },
        //         //body: {token}
        //     });
        //
        //
        //     console.log('response'+response)
        //
        //     if (response.ok) {
        //         localStorage.removeItem('auth_token');
        //         navigate('/login');
        //     } else {
        //         throw new Error('Failed to log out');
        //     }
        // } catch (error) {
        //     console.error(error);
        // }


        // Implement logout logic here if needed
        // For example, clearing the auth token from localStorage
        // Redirect to the login page.
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>Your App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">

                            {(localStorage.getItem('auth_token') !==null
                                &&
                                localStorage.getItem('auth_token')!=='null')
                                ? (
                                <>
                                    <Button onClick={handleLogout} variant="outline-primary">Logout</Button>

                                </>
                            ) : (
                                <><Button href="/register" variant="outline-primary">Register</Button> <Button href="/login" variant="outline-primary">Login</Button></>
                            )}
                        </Nav>

                    </Navbar.Collapse>
                    <Navbar.Collapse>
                        <Nav className="justify-content-end">
                            {(localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null') && (
                                <>
                                    <FontAwesomeIcon icon={faBriefcase} style={{ cursor: 'pointer', marginRight: '10px'}} />
                                    <FontAwesomeIcon onClick={showMessageModal} icon={faMessage} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px'  }} />
                                    <FontAwesomeIcon onClick={handleShowFriendListModal} icon={faUserFriends} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }} />
                                    <FontAwesomeIcon icon={faCaretDown} style={{ cursor: 'pointer', position: 'relative', marginLeft: '10px' }}>
                                        <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', display: 'inline-block', width: '0', height: '0', borderTop: '6px solid transparent', borderBottom: '6px solid #000', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></span>
                                    </FontAwesomeIcon>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Modal show={friendListModal} onHide={handleCloseFriendListModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Friend Requests</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>List of friend requests...</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFriendListModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={messageModal} onHide={closeMessageModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Messages</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>List of messages...</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFriendListModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Navbar>

            <div className="container">

                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/user/:id" element={<LandingPage/>} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
