import {Image} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";

const CompanyImage = ({companyId,size,trigger}) =>{

    const [profilePicUrl,setProfilePicUrl]=useState(null);
    const token=localStorage.getItem('auth_token');

    useEffect(()=>{
        getProfPic();
    },[trigger]);

    const getProfPic =async ()=>{
        axios.get(`http://localhost:8080/user/getCompanyLogo/${companyId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            responseType: 'arraybuffer'  // Ensures binary response
        })
            .then(response => {
                try {
                    console.log('response'+response.data);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const imageUrl = URL.createObjectURL(blob);
                    setProfilePicUrl(imageUrl);
                }
                catch (e){
                    setProfilePicUrl(null);
                }
            })
            .catch(error => {
                setProfilePicUrl(null);
                console.error("There was an error fetching the company logo!", error);
            });
    };

    return(
        <Image
            src={profilePicUrl ? profilePicUrl : "https://via.placeholder.com/150"}
            roundedCircle
            className="mb-3"
            style={{
                width: size,
                height: size,
                objectFit: 'cover'
            }}
            alt="Profile"
        />
    );
};

export default CompanyImage;