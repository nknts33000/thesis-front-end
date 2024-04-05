import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/SignUpIn/Register';
import Login from './components/SignUpIn/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import User from "./components/User";


function App() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

function Main() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token=localStorage.getItem('auth_token')
    const id=localStorage.getItem('user_id')
    const handleLogout = () => {
        // Implement logout logic here if needed
        // For example, clearing the auth token from localStorage
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
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

                            {isAuthenticated ? (


                                <Button onClick={handleLogout} variant="outline-primary">Logout</Button>

                            ) : (
                                <><Button href="/register" variant="outline-primary">Register</Button> <Button href="/login" variant="outline-primary">Login</Button></>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container">

                <Routes>
                    <Route
                        path="/login"
                        element={<Login setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user/:id" element={<User/>} />
                </Routes>
            </div>
        </>
    );
}

export default App;
