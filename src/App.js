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
import Profile from "./components/User/MyProfile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage, faUserFriends, faCaretDown, faBriefcase, faSearch} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Companies from "./components/Company/Companies";
import Advert from "./components/Advert/Advert";
import JobSearch from "./components/Advert/JobSearch";
import CreateCompany from "./components/Company/CreateCompany";
import CreateAdvert from "./components/Advert/CreateAdvert";
import Search from "./components/Advert/JobSearch";
import Searching from "./components/Searching/Searching";
import CompanyProfile from "./components/Company/CompanyProfile";
import MyProfile from "./components/User/MyProfile";
import ApplicantsPage from "./components/Advert/Applicants";
import ChatBox from "./components/Messages/ChatBox";
import './components/Messages/Chatbox.css';
import Conversations from "./components/Messages/Conversations";
import FriendRequestsModal from "./components/Requests/FriendRequestsModal";
import SettingsPage from "./components/Settings/SettingsPage";

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


    const token=localStorage.getItem('auth_token')
    const user_id =localStorage.getItem('user_id')
    const [isChatOpen, setIsChatOpen] = useState(false);
    // const [conversations,setConversations]=useState({})

    const toggleChatBox = () => {
        setIsChatOpen(!isChatOpen);
    };

    const showMessageModal = () => {

        setMessageModal(true);
    };
    const closeMessageModal = () => {
        console.log('closing modal');
        console.log('closing modal');
        setMessageModal(false);
    };


    const toJobSearch = () => {
        navigate('/search')
    }

    const toProf =()=>{
        const id= localStorage.getItem('user_id');
        if(id) navigate(`/user/${id}`);

    };


    const handleLogout = async () => {

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        navigate('/')
    };

    const toSearch = () =>{
        navigate('/searching')
    }

    return (
        <>

            <Navbar bg="primary" expand="lg">
                <Container>
                    <Navbar.Brand style={{cursor: 'pointer'}} onClick={() => {
                        navigate('/landingPage')
                    }}>JobNet</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">

                            {(localStorage.getItem('auth_token') !== null
                                &&
                                localStorage.getItem('auth_token') !== 'null')
                                ? (
                                    <>
                                        <Button onClick={handleLogout} variant="outline-light">Logout</Button>

                                    </>
                                ) : (
                                    <><Button href="/register" variant="outline-light">Register</Button> <Button
                                        href="/" variant="outline-light">Login</Button></>
                                )}
                        </Nav>

                    </Navbar.Collapse>
                    <Navbar.Collapse>
                        <Nav className="justify-content-end nav-icons">
                            {(localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null') && (
                                <>
                                    <div className="icon-container" onClick={toSearch}
                                         style={{marginLeft: '10px', 'margin-right': '10px', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faSearch} className="icon"
                                                         style={{marginLeft: '13px'}}/>
                                        <div className="icon-label">Search</div>
                                    </div>
                                    <div className="icon-container" onClick={toJobSearch}
                                         style={{marginLeft: '10px', 'margin-right': '10px', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faBriefcase} className="icon"
                                                         style={{marginLeft: '7px'}}/>
                                        <div className="icon-label">Jobs</div>
                                    </div>
                                    <div className="icon-container" onClick={showMessageModal}
                                         style={{'margin-right': '10px', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faMessage} className="icon"
                                                         style={{marginLeft: '25px'}}/>

                                        <div className="icon-label">Messages</div>

                                    </div>
                                    <div className="icon-container" onClick={handleShowFriendListModal}
                                         style={{cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faUserFriends} className="icon"
                                                         style={{marginLeft: '21px'}}/>
                                        <div className="icon-label">Requests</div>
                                    </div>
                                    <div className="icon-container"
                                         style={{'margin-top': '21px', 'margin-left': '15px'}}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="Secondary" className="p-0 custom-caret-toggle">
                                                More
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="custom-dropdown-menu">
                                                <Dropdown.Item
                                                    // onClick={() => navigate('/profile')}
                                                    onClick={toProf}
                                                >Profile</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate('/companies')}>My
                                                    Companies</Dropdown.Item>
                                                <Dropdown.Item onClick={()=>navigate('/settings')}>Settings</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>


            <Conversations
                messageModal={messageModal}
                closeMessageModal={closeMessageModal}
            />

            < FriendRequestsModal
                friendListModal={friendListModal} handleCloseFriendListModal={handleCloseFriendListModal}
            />

            <div className="container">

                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/landingPage" element={<LandingPage/>}/>
                    {/*<Route path="/profile" element={<MyProfile />} />*/}
                    <Route path="/companies" element={<Companies/>}/>
                    <Route path="/createCompany" element={<CreateCompany/>}/>
                    <Route path="/advert/:companyId/:advertId" element={<Advert/>}/>
                    <Route path="/createAdvert" element={<CreateAdvert/>}/>
                    <Route path="/search" element={<JobSearch/>}/>
                    <Route path="/searching" element={<Searching/>}/>
                    <Route path="/user/:id" element={<MyProfile/>}/>
                    <Route path="/company/:companyId" element={<CompanyProfile/>}/>
                    <Route path="/applicants/:advertId" element={<ApplicantsPage/>}/>
                    <Route path="/settings" element={<SettingsPage/>}/>
                </Routes>
            </div>
        </>
    );
}


export default App;


