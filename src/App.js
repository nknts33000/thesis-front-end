import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/SignUpIn/Register';
import Login from './components/SignUpIn/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";


function App() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

function Main() {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLogout = () => {
        // Implement logout logic here if needed
        // For example, clearing the auth token from localStorage
        localStorage.removeItem('auth_token');
        // Redirect to the login page
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
                                <Button onClick={handleShowModal} variant="outline-primary">Friend Requests</Button>
                                </>
                            ) : (
                                <><Button href="/register" variant="outline-primary">Register</Button> <Button href="/login" variant="outline-primary">Login</Button></>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Friend Requests</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add your friend request content here */}
                        <p>List of friend requests...</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Navbar>

            <div className="container">

                <Routes>
                    <Route
                        path="/login"
                        element={<Login/>}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user/:id" element={<LandingPage/>} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
