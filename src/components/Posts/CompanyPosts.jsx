import React, {useEffect, useState} from "react";
import { Card, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faShare, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import UserImage from "../Images/UserImage";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import CompanyImage from "../Images/CompanyImage";

const CompanyPosts = ({ initialPostDtos }) => {
    const [postdtos, setPostDtos] = useState([]); // State variable for posts data
    const [newComments, setNewComments] = useState({}); // State variable for new comments
    const user_id = localStorage.getItem('user_id');
    const navigate=useNavigate();

    useEffect(() => {
        setPostDtos(initialPostDtos);
    }, [initialPostDtos]);

    const handleCommentChange = (index, event) => {
        const { value } = event.target;
        setNewComments((prevState) => ({
            ...prevState,
            [index]: value,
        }));
    };

    const submitComment = async (index) => {
        const post = postdtos[index].post; // Access the specific post using the index

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

        // getPosts();
    };

    const toUserProf = (id) =>{
        navigate(`/user/${id}`);
    };

    return (
        <>
            {postdtos.length > 0 ? (
                postdtos.map((postdto, index) => (
                    <Card key={index} className="mt-3">
                        {/*<Card.Title>*/}
                        {/*    */}
                        {/*</Card.Title>*/}
                        <Card.Body>
                            <Card.Title onClick={()=>toUserProf(postdto.user.id)} style={{cursor:'pointer'}}>
                                <CompanyImage id={postdto.user.id} size={'60px'} />
                                <strong style={{marginLeft:'10px'}}>{postdto.user.firstname} {postdto.user.lastname}</strong>
                            </Card.Title>
                            <Card.Text>{postdto.post.content}</Card.Text>
                            <div>
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    style={{ cursor: "pointer", marginRight: "10px" }}
                                />
                                <FontAwesomeIcon
                                    icon={faComment}
                                    style={{ cursor: "pointer", marginRight: "10px" }}
                                />
                                <FontAwesomeIcon
                                    icon={faShare}
                                    style={{ cursor: "pointer", marginRight: "10px" }}
                                />
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
                                {postdto.comments.map((comment, cIndex) => (
                                    <div key={cIndex} className="p-2 border rounded my-1 bg-light">
                                        {/* Display commentator's profile picture */}
                                        <div className="commentator-info" style={{marginLeft:'10px',cursor:'pointer'}}

                                        >
                                            <UserImage id={comment.user.id} size={'30px'} onClick={()=>toUserProf(comment.user.id)}/>
                                            <strong style={{marginLeft:'5px'}} onClick={()=>toUserProf(comment.user.id)}>
                                                {comment.user.firstname} {comment.user.lastname}
                                            </strong>
                                        </div>
                                        {/* Comment text */}
                                        <div style={{marginLeft:'10px'}}>{comment.comment.content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="mt-3">No posts yet.</div>
            )}
        </>
    );
};

export default CompanyPosts;
