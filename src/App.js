import React, {useEffect, useState} from 'react';
import {
    Navbar,
    Nav,
    Container,
    Button,
    Modal,
    NavItem,
    Dropdown,
    DropdownButton,
    Table,
    Row,
    Col
} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/SignUpIn/Register';
import Login from './components/SignUpIn/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./components/User/LandingPage";
import Profile from "./components/User/Profile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage, faUserFriends, faCaretDown, faBriefcase} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Companies from "./components/Company/Companies";
import Advert from "./components/Advert/Advert";
import JobSearch from "./components/Advert/Search";
import CreateCompany from "./components/Company/CreateCompany";
import CreateAdvert from "./components/Advert/CreateAdvert";
import Search from "./components/Advert/Search";


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

    const toJobSearch = () => {
        navigate('/search')
    }

    // useEffect(() => {
    //     console.log(localStorage.getItem('auth_token'))
    // }, []);

    const handleLogout = async () => {

        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand style={{cursor:'pointer'}} onClick={()=>{navigate('/landingPage')}}>JobNet</Navbar.Brand>
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
                        <Nav className="justify-content-end nav-icons">
                            {(localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null') && (
                                <>
                                    <div className="icon-container" onClick={toJobSearch} style={{'margin-right':'10px',cursor:'pointer'}}>
                                        <FontAwesomeIcon icon={faBriefcase} className="icon" style={{marginLeft:'7px'}}/>
                                        <div className="icon-label">Jobs</div>
                                    </div>
                                    <div className="icon-container" onClick={showMessageModal} style={{'margin-right':'10px',cursor:'pointer'}}>
                                        <FontAwesomeIcon icon={faMessage} className="icon" style={{marginLeft:'25px'}}/>
                                        <div className="icon-label">Messages</div>
                                    </div>
                                    <div className="icon-container" onClick={handleShowFriendListModal} style={{cursor:'pointer'}}>
                                        <FontAwesomeIcon icon={faUserFriends} className="icon" style={{marginLeft:'21px'}}/>
                                        <div className="icon-label">Requests</div>
                                    </div>
                                    <div className="icon-container" style={{'margin-top':'21px','margin-left':'15px'}}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="Secondary" className="p-0 custom-caret-toggle">
                                                More
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="custom-dropdown-menu">
                                                <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate('/companies')}>My Companies</Dropdown.Item>
                                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
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
                        <Button variant="secondary" onClick={closeMessageModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Navbar>

            <div className="container">

                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/landingPage" element={<LandingPage/>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/companies" element={<Companies/>}/>
                    <Route path="/createCompany" element={<CreateCompany/>}/>
                    <Route path="/advert" element={<Advert/>}/>
                    <Route path="/createAdvert" element={<CreateAdvert/>}/>
                    <Route path="/search" element={<Search/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
