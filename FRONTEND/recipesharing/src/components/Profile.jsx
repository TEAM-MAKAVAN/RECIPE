import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation


const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userFollower, setUserFollower] = useState(null);
    const [userFollowing, setUserFollowing] = useState(null);
    const jwtToken = localStorage.getItem('jwtToken');
    
    useEffect(() => {
        if (jwtToken) {
            const decodedToken = jwtDecode(jwtToken);
            const userId = decodedToken._id;

            const fetchUserData = async () => {
                try {
                    // Fetch user profile data
                    const response1 = await axios.get(`http://localhost:8001/api/v1/users/users/${userId}`);
                    setUserProfile(response1.data); // Assuming response.data contains user details
                    
                    // Fetch user followers
                    const channelId = response1.data._id; // Assuming _id exists in user data
                    const response2 = await axios.post(
                        `http://localhost:8001/api/v1/subscription/getUserChannelSubscribers/${channelId}`,
                        {},
                        {
                            withCredentials: true, // Send cookies
                            headers: {
                                Authorization: `Bearer ${jwtToken}` // Optionally add authorization header
                            }
                        }
                    );
                    setUserFollower(response2.data.subscriberCount);
                    // console.log(userFollower); // Assuming response2.data is the followers data
                    // console.log(response2.data.subscriberCount);


                    //getting subsribed count
                    const subscriberId = response1.data._id;
                    console.log(subscriberId)
                    const response3 = await axios.post(
                        `http://localhost:8001/api/v1/subscription/getSubscribedChannels/${subscriberId}`,
                        {},
                        {
                            withCredentials: true, // Send cookies
                            headers: {
                                Authorization: `Bearer ${jwtToken}` // Optionally add authorization header
                            }
                        }
                    );
                    setUserFollowing(response3.data.subscribedToCount);
                    // console.log(userFollower); // Assuming response2.data is the followers data
                    // console.log(response2.data.subscriberCount);




                  
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Handle error fetching
                }
            };
            

            fetchUserData();
        }
    }, [jwtToken]);

    if (!userProfile) {
        return <div>Loading...</div>; // Placeholder for loading state
    }

    return (
        // <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        //     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        //         <div style={{ marginRight: '20px' }}>
        //             <img src={userProfile.profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        //         </div>
        //         <div>
        //             <h2>{userProfile.username}</h2>
        //             <p>Email: {userProfile.email}</p>
                  
        //             <p>
        //                  <Link to="/saved-recipes">View Saved Recipes</Link>
        //             </p>
                    
        //             <p> Follower : {userFollower}</p>
        //            <p> Following : {userFollowing}</p>
        //         </div>
        //     </div>
        // </div>
         <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
         <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
           <div className="flex flex-col items-center md:flex-row md:items-start">
             <img className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-300" src={userProfile.profilePicture} alt="Profile" />
             <div className="flex flex-col items-center md:items-start md:ml-6 mt-4 md:mt-0">
               <h1 className="text-3xl font-bold">{userProfile.username}</h1>
               {/* <p className="mt-2 text-gray-600 text-center md:text-left">{bio}</p> */}
               <div className="flex mt-4">
                 <div className="flex flex-col items-center mr-6">
                   <span className="font-bold text-lg">{userFollower}</span>
                   <span className="text-gray-600">Followers</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="font-bold text-lg">{userFollowing}</span>
                   <span className="text-gray-600">Following</span>
                 </div>
               </div>
               <button className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700">
                 Edit Profile
               </button>
             </div>
           </div>
           {/* <div className="mt-8">
             <h2 className="text-2xl font-bold mb-4">Posts</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {posts.map((post) => (
                 <div key={post.id} className="bg-white rounded-lg shadow-lg">
                   <img className="w-full h-64 object-cover rounded-t-lg" src={post.imageUrl} alt="Post" />
                   <div className="p-4">
                     <h3 className="font-bold">{post.title}</h3>
                     <p className="text-gray-600">{post.description}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div> */}
         </div>
       </div>
    );
};

export default Profile;
