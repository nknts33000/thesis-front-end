// import React, { useEffect, useState } from "react";
// import { Card, Modal, Button, Form } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faComment, faShare, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
// import UserImage from "../Images/UserImage";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import CompanyImage from "../Images/CompanyImage";
// import "bootstrap/dist/css/bootstrap.min.css";
//
// const Post = ({ initialPostDtos, fetchPosts }) => {
//     const [postDtos, setPostDtos] = useState([]); // State variable for posts data
//     const [newComments, setNewComments] = useState({}); // State variable for new comments
//     const [likedStatus, setLikedStatus] = useState({}); // State variable for liked status of posts
//     const [shareModalShow, setShareModalShow] = useState(false); // State variable for modal visibility
//     const [shareDescription, setShareDescription] = useState(''); // State variable for share description
//     const [currentPostId, setCurrentPostId] = useState(null); // State variable for current post ID being shared
//     const user_id = localStorage.getItem('user_id');
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         setPostDtos(initialPostDtos);
//         console.log('initial company posts:', initialPostDtos);
//         fetchLikedStatus(initialPostDtos);
//         console.log('find post')
//     }, [initialPostDtos]);
//
//     const fetchLikedStatus = async (posts) => {
//         const token = localStorage.getItem('auth_token');
//         const headers = {
//             'Content-type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         };
//
//         // Check if posts is an array
//         console.log('type of posts', Array.isArray(posts));
//         if (!Array.isArray(posts)) {
//             console.error('Posts is not an array:', posts);
//             return;
//         }
//
//         // Extract postIds from posts
//         const postIds = posts.map(postDTO => {
//             if (postDTO && postDTO.post && postDTO.post.postId) {
//                 return postDTO.post.postId;
//             } else {
//                 console.error('Invalid postDTO structure:', postDTO);
//                 return null;
//             }
//         }).filter(postId => postId !== null);
//
//         console.log('postIds', postIds);
//
//         try {
//             const response = await axios.post(
//                 `http://localhost:8080/user/checkLikes/${user_id}`,
//                 { postIds: postIds }, // Sending postIds array in the request body
//                 { headers }
//             );
//             setLikedStatus(response.data); // Assuming response.data is an object with post IDs as keys and boolean liked status as values
//             console.log('liked status', response.data);
//         } catch (error) {
//             console.error("Error fetching liked status:", error);
//         }
//     };
//
//     const handleCommentChange = (index, event) => {
//         const { value } = event.target;
//         setNewComments((prevState) => ({
//             ...prevState,
//             [index]: value,
//         }));
//     };
//
//     const submitComment = async (index) => {
//         const post = postDtos[index].post; // Access the specific post using the index
//
//         if (!post) {
//             console.error("Invalid post or postId");
//             return;
//         }
//
//         const post_id = post.postId;
//         const content = newComments[index]; // Get the comment content from state
//
//         if (!content || content.trim() === '') {
//             console.log("Comment is empty.");
//             return;
//         }
//
//         const token = localStorage.getItem('auth_token');
//         const headers = {
//             'Content-type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         };
//         const body = { content: content };
//
//         const url = `http://localhost:8080/user/addComment/${post_id}/${user_id}`; // Update this URL to your server's URL for posting comments
//
//         try {
//             await axios.post(url, JSON.stringify(body), { headers });
//             setNewComments((prevState) => ({
//                 ...prevState,
//                 [index]: '' // Clear input field after successful submission
//             }));
//             // Refresh comments or manage state updates as needed
//
//             try {
//                 const response = await axios.get(`http://localhost:8080/user/getCommentsOfPost/${post_id}`, { headers });
//                 const updatedComments = response.data;
//                 setPostDtos((prevPostDtos) => {
//                     const updatedPostDtos = [...prevPostDtos];
//                     updatedPostDtos[index].comments = updatedComments;
//                     return updatedPostDtos;
//                 });
//                 console.log(updatedComments);
//             } catch (e) {
//                 console.log('Failed to fetch post\'s comments:', e);
//             }
//
//         } catch (error) {
//             console.error("Error submitting comment:", error);
//         }
//
//     };
//
//     const toUserProf = (id) => {
//         navigate(`/user/${id}`);
//     };
//
//     const toCompanyPage = (companyId) => {
//         navigate(`/company/${companyId}`);
//     };
//
//     const likePost = async (post_id) => {
//         const token = localStorage.getItem('auth_token');
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         };
//
//         try {
//             await axios.post(`http://localhost:8080/user/like/${user_id}/${post_id}`, {}, { headers });
//             setLikedStatus((prevStatus) => ({
//                 ...prevStatus,
//                 [post_id]: true // Update like status for the specific post
//             }));
//             fetchPosts(); // Notify the parent component to refetch the data
//             fetchLikedStatus(postDtos);
//         } catch (error) {
//             console.error("Error liking post:", error);
//         }
//     };
//
//     const unlikePost = async (post_id) => {
//         const token = localStorage.getItem('auth_token');
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         };
//
//         try {
//             await axios.delete(`http://localhost:8080/user/unlike/${user_id}/${post_id}`, { headers });
//             setLikedStatus((prevStatus) => ({
//                 ...prevStatus,
//                 [post_id]: false // Update like status for the specific post
//             }));
//             fetchPosts(); // Notify the parent component to refetch the data
//         } catch (error) {
//             console.error("Error unliking post:", error);
//         }
//     };
//
//     const handleShareClick = (post_id) => {
//         setCurrentPostId(post_id);
//         setShareModalShow(true);
//     };
//
//     const handleShareDescriptionChange = (event) => {
//         setShareDescription(event.target.value);
//     };
//
//     const sharePost = async () => {
//         const token = localStorage.getItem('auth_token');
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         };
//
//         const body = { description: shareDescription };
//
//         try {
//             await axios.post(`http://localhost:8080/user/share/${user_id}/${currentPostId}`, body, { headers });
//             fetchPosts(); // Notify the parent component to refetch the data
//             setShareDescription(''); // Clear the description
//             setShareModalShow(false); // Close the modal
//         } catch (error) {
//             console.error("Error sharing post:", error);
//         }
//     };
//
//     return (
//         <>
//             {postDtos.length > 0 ? (
//                 postDtos.map((postDto, index) => (
//                     <Card key={index} className="mt-3">
//                         <Card.Body>
//                             {postDto.user ? (
//                                 <Card.Title onClick={() => toUserProf(postDto.user.id)} style={{ cursor: 'pointer' }}>
//                                     <UserImage id={postDto.user.id} size={'60px'} />
//                                     <strong style={{ marginLeft: '10px' }}>
//                                         {postDto.user.firstname} {postDto.user.lastname}
//                                     </strong>
//                                 </Card.Title>
//                             ) : (
//                                 <Card.Title onClick={() => toCompanyPage(postDto.company.companyId)} style={{ cursor: 'pointer' }}>
//                                     <CompanyImage companyId={postDto.company.companyId} size={'60px'} />
//                                     <strong style={{ marginLeft: '10px' }}>{postDto.company.name}</strong>
//                                 </Card.Title>
//                             )}
//
//                             <Card.Text>{postDto.post.content}</Card.Text>
//
//                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "200px" }}>
//                                 <div style={{ textAlign: "center" }}>
//                                     <FontAwesomeIcon
//                                         icon={faThumbsUp}
//                                         style={{
//                                             cursor: "pointer",
//                                             color: likedStatus[postDto.post.postId] ? "blue" : "black"
//                                         }}
//                                         onClick={() => likedStatus[postDto.post.postId] ? unlikePost(postDto.post.postId) : likePost(postDto.post.postId)}
//                                     />
//                                     <h6>{postDto.post.likes.length}</h6>
//                                 </div>
//                                 <div style={{ textAlign: "center" }}>
//                                     <FontAwesomeIcon
//                                         icon={faComment}
//                                         style={{ cursor: "pointer" }}
//                                     />
//                                     <h6>{postDto.comments.length}</h6>
//                                 </div>
//                                 <div style={{ textAlign: "center" }}>
//                                     <FontAwesomeIcon
//                                         icon={faShare}
//                                         style={{ cursor: "pointer" }}
//                                         onClick={() => handleShareClick(postDto.post.postId)}
//                                     />
//                                     <h6>{postDto.post.shares.length}</h6>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                         {/* Comments section */}
//                         <div className="comments-section">
//                             {/* New comment input */}
//                             <div className="new-comment-input">
//                                 <textarea
//                                     value={newComments[index] || ''}
//                                     onChange={(event) => handleCommentChange(index, event)}
//                                     placeholder="Add a comment..."
//                                     className="comment-input"
//                                 />
//                                 <button onClick={() => submitComment(index)}>Post</button>
//                             </div>
//                             {/* Existing comments */}
//                             <div className="existing-comments mb-2">
//                                 {postDto.comments.map((comment, cIndex) => (
//                                     <div key={cIndex} className="p-2 border rounded my-1 bg-light">
//                                         {/* Display commentator's profile picture */}
//                                         <div className="commentator-info" style={{ marginLeft: '10px', cursor: 'pointer' }}
//                                              onClick={() => toUserProf(comment.user.id)}
//                                         >
//                                             <UserImage id={comment.user.id} size={'30px'} />
//                                             <strong style={{ marginLeft: '5px' }}>
//                                                 {comment.user.firstname} {comment.user.lastname}
//                                             </strong>
//                                         </div>
//                                         {/* Comment text */}
//                                         <div style={{ marginLeft: '10px' }}>{comment.comment.content}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </Card>
//                 ))
//             ) : (
//                 <div className="mt-3">No posts yet.</div>
//             )}
//
//             {/* Share Modal */}
//             <Modal show={shareModalShow} onHide={() => setShareModalShow(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Share Post</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form.Group controlId="shareDescription">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control
//                             as="textarea"
//                             rows={3}
//                             value={shareDescription}
//                             onChange={handleShareDescriptionChange}
//                         />
//                     </Form.Group>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShareModalShow(false)}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={sharePost}>
//                         Share
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// };
//
// export default Post;

import React, { useEffect, useState } from "react";
import { Card, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faShare, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import UserImage from "../Images/UserImage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CompanyImage from "../Images/CompanyImage";
import "bootstrap/dist/css/bootstrap.min.css";

const Post = ({ initialPostDtos, fetchPosts }) => {
    const [postDtos, setPostDtos] = useState([]); // State variable for posts data
    const [newComments, setNewComments] = useState({}); // State variable for new comments
    const [likedStatus, setLikedStatus] = useState({}); // State variable for liked status of posts
    const [shareModalShow, setShareModalShow] = useState(false); // State variable for modal visibility
    const [shareDescription, setShareDescription] = useState(''); // State variable for share description
    const [currentPostId, setCurrentPostId] = useState(null); // State variable for current post ID being shared
    const user_id = localStorage.getItem('user_id');
    const navigate = useNavigate();

    useEffect(() => {
        setPostDtos(initialPostDtos);
        console.log('initial company posts:', initialPostDtos);
        fetchLikedStatus(initialPostDtos);
        console.log('find post');
    }, [initialPostDtos]);

    const fetchLikedStatus = async (posts) => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Check if posts is an array
        console.log('type of posts', Array.isArray(posts));
        if (!Array.isArray(posts)) {
            console.error('Posts is not an array:', posts);
            return;
        }

        // Extract postIds from posts
        const postIds = posts.map(postDTO => {
            if (postDTO && postDTO.post && postDTO.post.postId) {
                return postDTO.post.postId;
            } else {
                console.error('Invalid postDTO structure:', postDTO);
                return null;
            }
        }).filter(postId => postId !== null);

        console.log('postIds', postIds);

        try {
            const response = await axios.post(
                `http://localhost:8080/user/checkLikes/${user_id}`,
                { postIds: postIds }, // Sending postIds array in the request body
                { headers }
            );
            setLikedStatus(response.data); // Assuming response.data is an object with post IDs as keys and boolean liked status as values
            console.log('liked status', response.data);
        } catch (error) {
            console.error("Error fetching liked status:", error);
        }
    };

    const handleCommentChange = (index, event) => {
        const { value } = event.target;
        setNewComments((prevState) => ({
            ...prevState,
            [index]: value,
        }));
    };

    const submitComment = async (index) => {
        const post = postDtos[index].post; // Access the specific post using the index

        if (!post) {
            console.error("Invalid post or postId");
            return;
        }

        const post_id = post.postId;
        const content = newComments[index]; // Get the comment content from state

        if (!content || content.trim() === '') {
            console.log("Comment is empty.");
            return;
        }

        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const body = { content: content };

        const url = `http://localhost:8080/user/addComment/${post_id}/${user_id}`; // Update this URL to your server's URL for posting comments

        try {
            await axios.post(url, JSON.stringify(body), { headers });
            setNewComments((prevState) => ({
                ...prevState,
                [index]: '' // Clear input field after successful submission
            }));
            // Refresh comments or manage state updates as needed

            try {
                const response = await axios.get(`http://localhost:8080/user/getCommentsOfPost/${post_id}`, { headers });
                const updatedComments = response.data;
                setPostDtos((prevPostDtos) => {
                    const updatedPostDtos = [...prevPostDtos];
                    updatedPostDtos[index].comments = updatedComments;
                    return updatedPostDtos;
                });
                console.log(updatedComments);
            } catch (e) {
                console.log('Failed to fetch post\'s comments:', e);
            }

        } catch (error) {
            console.error("Error submitting comment:", error);
        }

    };

    const toUserProf = (id) => {
        navigate(`/user/${id}`);
    };

    const toCompanyPage = (companyId) => {
        navigate(`/company/${companyId}`);
    };

    const likePost = async (post_id) => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            await axios.post(`http://localhost:8080/user/like/${user_id}/${post_id}`, {}, { headers });
            setLikedStatus((prevStatus) => ({
                ...prevStatus,
                [post_id]: true // Update like status for the specific post
            }));
            fetchPosts(); // Notify the parent component to refetch the data
            fetchLikedStatus(postDtos);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const unlikePost = async (post_id) => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            await axios.delete(`http://localhost:8080/user/unlike/${user_id}/${post_id}`, { headers });
            setLikedStatus((prevStatus) => ({
                ...prevStatus,
                [post_id]: false // Update like status for the specific post
            }));
            fetchPosts(); // Notify the parent component to refetch the data
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };

    const handleShareClick = (post_id) => {
        setCurrentPostId(post_id);
        setShareModalShow(true);
    };

    const handleShareDescriptionChange = (event) => {
        setShareDescription(event.target.value);
    };

    const sharePost = async () => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const body = { description: shareDescription };

        try {
            await axios.post(`http://localhost:8080/user/share/${user_id}/${currentPostId}`, body, { headers });
            fetchPosts(); // Notify the parent component to refetch the data
            setShareDescription(''); // Clear the description
            setShareModalShow(false); // Close the modal
        } catch (error) {
            console.error("Error sharing post:", error);
        }
    };

    const getCurrentPostDetails = () => {
        const postDto = postDtos.find(postDto => postDto.post.postId === currentPostId);
        if (!postDto) return null;

        const userOrCompany = postDto.user
            ? { type: 'User', name: `${postDto.user.firstname} ${postDto.user.lastname}`, id: postDto.user.id, imageComponent: <UserImage id={postDto.user.id} size={'60px'} /> }
            : { type: 'Company', name: postDto.company.name, id: postDto.company.companyId, imageComponent: <CompanyImage companyId={postDto.company.companyId} size={'60px'} /> };

        return (
            <div>
                <h5>{userOrCompany.type}:</h5>
                <div onClick={() => userOrCompany.type === 'User' ? toUserProf(userOrCompany.id) : toCompanyPage(userOrCompany.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {userOrCompany.imageComponent}
                    <strong style={{ marginLeft: '10px' }}>{userOrCompany.name}</strong>
                </div>
                <p>{postDto.post.content}</p>
            </div>
        );
    };

    return (
        <>
            {postDtos.length > 0 ? (
                postDtos.map((postDto, index) => (
                    <Card key={index} className="mt-3">
                        <Card.Body>
                            {postDto.user ? (
                                <Card.Title onClick={() => toUserProf(postDto.user.id)} style={{ cursor: 'pointer' }}>
                                    <UserImage id={postDto.user.id} size={'60px'} />
                                    <strong style={{ marginLeft: '10px' }}>
                                        {postDto.user.firstname} {postDto.user.lastname}
                                    </strong>
                                </Card.Title>
                            ) : (
                                <Card.Title onClick={() => toCompanyPage(postDto.company.companyId)} style={{ cursor: 'pointer' }}>
                                    <CompanyImage companyId={postDto.company.companyId} size={'60px'} />
                                    <strong style={{ marginLeft: '10px' }}>{postDto.company.name}</strong>
                                </Card.Title>
                            )}

                            <Card.Text>{postDto.post.content}</Card.Text>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "200px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        style={{
                                            cursor: "pointer",
                                            color: likedStatus[postDto.post.postId] ? "blue" : "black"
                                        }}
                                        onClick={() => likedStatus[postDto.post.postId] ? unlikePost(postDto.post.postId) : likePost(postDto.post.postId)}
                                    />
                                    <h6>{postDto.post.likes.length}</h6>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FontAwesomeIcon
                                        icon={faComment}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <h6>{postDto.comments.length}</h6>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FontAwesomeIcon
                                        icon={faShare}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleShareClick(postDto.post.postId)}
                                    />
                                    <h6>{postDto.post.shares.length}</h6>
                                </div>
                            </div>
                        </Card.Body>
                        {/* Comments section */}
                        <div className="comments-section">
                            {/* New comment input */}
                            <div className="new-comment-input">
                                <textarea
                                    value={newComments[index] || ''}
                                    onChange={(event) => handleCommentChange(index, event)}
                                    placeholder="Add a comment..."
                                    className="comment-input"
                                />
                                <button onClick={() => submitComment(index)}>Post</button>
                            </div>
                            {/* Existing comments */}
                            <div className="existing-comments mb-2">
                                {postDto.comments.map((comment, cIndex) => (
                                    <div key={cIndex} className="p-2 border rounded my-1 bg-light">
                                        {/* Display commentator's profile picture */}
                                        <div className="commentator-info" style={{ marginLeft: '10px', cursor: 'pointer' }}
                                             onClick={() => toUserProf(comment.user.id)}
                                        >
                                            <UserImage id={comment.user.id} size={'30px'} />
                                            <strong style={{ marginLeft: '5px' }}>
                                                {comment.user.firstname} {comment.user.lastname}
                                            </strong>
                                        </div>
                                        {/* Comment text */}
                                        <div style={{ marginLeft: '10px' }}>{comment.comment.content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="mt-3">No posts yet.</div>
            )}

            {/* Share Modal */}
            <Modal show={shareModalShow} onHide={() => setShareModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Share Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {getCurrentPostDetails()}
                    <Form.Group controlId="shareDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={shareDescription}
                            onChange={handleShareDescriptionChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShareModalShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={sharePost}>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Post;
