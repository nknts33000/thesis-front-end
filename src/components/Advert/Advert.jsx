import React, { useEffect, useState } from 'react';
import {Container, Card, Image} from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from "axios";

const JobAdvertisementPage = () => {
    const [job, setJob] = useState(null);
    const [company,setCompany] = useState(null);
    const [logo,setLogo]=useState(null);
    const { advertId } = useParams();
    const {companyId}=useParams();
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getAdvert/${advertId}`, {
                    headers: {
                        "Content-Type": "Application/Json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setJob(response.data);
            } catch (error) {
                console.error("There was an error fetching the job advertisement!", error);
            }
        };

        const getCompany = async ()=>{
            try {
                const response = await axios.get(`http://localhost:8080/user/getCompany/${companyId}`, {
                    headers: {
                        "Content-Type": "Application/Json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setCompany(response.data);
            } catch (error) {
                console.error("There was an error fetching the company!", error);
            }
        };

        const fetchCompanyLogo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/getCompanyLogo/${companyId}`, {
                    headers: { "Content-Type": "Application/Json", Authorization: `Bearer ${token}` },
                    responseType: 'arraybuffer' // Ensure response is treated as an array buffer
                });

                // Create a blob from the byte array
                const blob = new Blob([response.data], { type: response.headers['content-type'] });

                // Create an object URL from the blob
                const imageUrl = URL.createObjectURL(blob);

                // Set the image URL as the logo
                setLogo(imageUrl);
            } catch (error) {
                console.error("Error fetching company logo", error);
            }
        };

        getCompany();
        fetchJob();
        fetchCompanyLogo();
    }, [advertId,companyId, token]);

    if (!job) {
        return <p>Loading...</p>;
    }

    // return (
    //     <Container>
    //         <h1>{job.jobTitle}</h1>
    //         <Card>
    //             <Card.Body>
    //                 <Card.Title>Summary</Card.Title>
    //                 <Card.Text>{job.jobSummary}</Card.Text>
    //             </Card.Body>
    //         </Card>
    //         {/*<Card>*/}
    //         {/*    <Card.Body>*/}
    //         {/*        <Card.Title>Key Responsibilities</Card.Title>*/}
    //         {/*        <Card.Text>{job.keyResponsibilities}</Card.Text>*/}
    //         {/*    </Card.Body>*/}
    //         {/*</Card>*/}
    //         {/*<Card>*/}
    //         {/*    <Card.Body>*/}
    //         {/*        <Card.Title>Qualifications</Card.Title>*/}
    //         {/*        <Card.Text>{job.qualifications}</Card.Text>*/}
    //         {/*    </Card.Body>*/}
    //         {/*</Card>*/}
    //         <Card>
    //             <Card.Body>
    //                 <Card.Title>Location</Card.Title>
    //                 <Card.Text>{job.location}</Card.Text>
    //             </Card.Body>
    //         </Card>
    //         {/*<Card>*/}
    //         {/*    <Card.Body>*/}
    //         {/*        <Card.Title>Salary and Benefits</Card.Title>*/}
    //         {/*        <Card.Text>{job.salaryAndBenefits}</Card.Text>*/}
    //         {/*    </Card.Body>*/}
    //         {/*</Card>*/}
    //         {/*<Card>*/}
    //         {/*    <Card.Body>*/}
    //         {/*        <Card.Title>How to Apply</Card.Title>*/}
    //         {/*        <Card.Text>{job.howToApply}</Card.Text>*/}
    //         {/*    </Card.Body>*/}
    //         {/*</Card>*/}
    //         <Card>
    //             <Card.Body>
    //                 <Card.Title>Contact Information</Card.Title>
    //                 <Card.Text>{job.contactInformation}</Card.Text>
    //             </Card.Body>
    //         </Card>
    //     </Container>
    // );

    return (
        <Container>

            {
                company &&
                (
                    <>
                    <Image
                        src={logo || 'placeholder.jpg'}
                        roundedCircle
                        style={{width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer'}}

                    />
                    <h3>{company.name}</h3>
                    <hr/>
                    </>
                )
            }

            {!job ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h1>{job.jobTitle}</h1>
                    <Card>
                        <Card.Body>
                            <Card.Title>Summary</Card.Title>
                            <Card.Text>{job.jobSummary}</Card.Text>
                        </Card.Body>
                    </Card>
                    {/*<Card>*/}
                    {/*    <Card.Body>*/}
                    {/*        <Card.Title>Key Responsibilities</Card.Title>*/}
                    {/*        <Card.Text>{job.keyResponsibilities}</Card.Text>*/}
                    {/*    </Card.Body>*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*    <Card.Body>*/}
                    {/*        <Card.Title>Qualifications</Card.Title>*/}
                    {/*        <Card.Text>{job.qualifications}</Card.Text>*/}
                    {/*    </Card.Body>*/}
                    {/*</Card>*/}
                    <Card>
                        <Card.Body>
                            <Card.Title>Location</Card.Title>
                            <Card.Text>{job.location}</Card.Text>
                        </Card.Body>
                    </Card>
                    {/*<Card>*/}
                    {/*    <Card.Body>*/}
                    {/*        <Card.Title>Salary and Benefits</Card.Title>*/}
                    {/*        <Card.Text>{job.salaryAndBenefits}</Card.Text>*/}
                    {/*    </Card.Body>*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*    <Card.Body>*/}
                    {/*        <Card.Title>How to Apply</Card.Title>*/}
                    {/*        <Card.Text>{job.howToApply}</Card.Text>*/}
                    {/*    </Card.Body>*/}
                    {/*</Card>*/}
                    <Card>
                        <Card.Body>
                            <Card.Title>Contact Information</Card.Title>
                            <Card.Text>{job.contactInformation}</Card.Text>
                        </Card.Body>
                    </Card>
                </>
            )}
        </Container>
    );

};

export default JobAdvertisementPage;
