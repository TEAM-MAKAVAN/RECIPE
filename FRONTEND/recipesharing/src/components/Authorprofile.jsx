import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode

const Authorprofile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userFollower, setUserFollower] = useState(null);
    const [userFollowing, setUserFollowing] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false); // State to track subscription status
    const jwtToken = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken._id;

    let { authorId } = useParams(); // Move useParams inside the component body

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const response1 = await axios.get(`http://localhost:8001/api/v1/users/users/${authorId}`);
                setUserProfile(response1.data); // Assuming response.data contains user details

                // Fetch user followers (if needed)
                const channelId = response1.data._id; // Assuming _id exists in user data
                const response2 = await axios.post(
                    `http://localhost:8001/api/v1/subscription/getUserChannelSubscribers/${channelId}`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    }
                );
                setUserFollower(response2.data.subscriberCount);

                // Fetch user subscriptions (if needed)
                const response3 = await axios.post(
                    `http://localhost:8001/api/v1/subscription/getSubscribedChannels/${userId}`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    }
                );
                setUserFollowing(response3.data.subscribedToCount);

                // Check if current user is subscribed to this channel
                const isUserSubscribed = response3.data.subscribedUsers.includes(authorId);
                setIsSubscribed(isUserSubscribed);

            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error fetching
            }
        };

        fetchUserData();
    }, [authorId, userId]); // Include authorId and userId in the dependency array to fetch data when they change

    const handleSubscribeToggle = async () => {
        try {
            // Perform toggle subscription request
            const response = await axios.get(
                `http://localhost:8001/api/v1/subscription/toggleSubscription?channelId=${authorId}`,
                {
                    withCredentials: true, // Send cookies
                    headers: {
                        Authorization: `Bearer ${jwtToken}` // Optionally add authorization header
                    }
                }
            );

            // Update subscription status
            setIsSubscribed(!isSubscribed);
            console.log(response.data); // Optionally, handle response if needed
        } catch (error) {
            console.error('Error toggling subscription:', error);
            // Handle error toggling subscription
        }
    };

    if (!userProfile) {
        return <div>Loading...</div>;
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
                    <p><Link to="/saved-recipes">View Saved Recipes</Link></p>
                    <p>Follower: {userFollower}</p>
                    <p>Following: {userFollowing}</p>
                    {/* Toggle subscribe button */}
                    <button
                        className={`bg-${isSubscribed ? 'green' : 'blue'}-500 hover:bg-${isSubscribed ? 'green' : 'blue'}-700 text-white font-bold py-2 px-4 rounded`}
                        onClick={handleSubscribeToggle}
                    >
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authorprofile;
