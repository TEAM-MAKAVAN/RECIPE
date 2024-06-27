import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userFollwer, setUserFollower]=useState(null);
    const [userFollowing, setUserFollowing]=useState(null);
    const jwtToken = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken._id;
 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response1 = await axios.get(`http://localhost:8001/api/v1/users/users/${userId}`);
                setUserProfile(response1.data); // Assuming response.data contains user details
                console.log(response1)
                   
                
                // const channelId = userProfile._id;
            //     const channelId = response1.data._id;
            //     console.log( channelId)
            //    try {
            //      const response2 = await axios.post(`http://localhost:8001/api/v1/subscription/getUserChannelSubscribers/${channelId}`);
            //      setUserFollower(response2.data); 
            //      console.log(response2);
            //    } catch (error) {
            //     console.log(error)
            //    }

                // const response3= await axios.post('http://localhost:8001/api/v1/subscription/getSubscribedChannels');
                // setUserFollowing(response2.data); 
                // console.log(response3);

            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error fetching
            }
        };

        fetchUserData();
    }, [userId]);

    if (!userProfile) {
        return <div>Loading...</div>; // Placeholder for loading state
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ marginRight: '20px' }}>
                    <img src={userProfile.profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </div>
                <div>
                    <h2>{userProfile.username}</h2>
                    <p>Email: {userProfile.email}</p>
                    <p>Saved Recipes: {userProfile.savedRecipes}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
