import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MainHomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchAllRecipes = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
                const decodedToken = jwtDecode(jwtToken);
                setUserProfile(decodedToken);
   
                const response = await axios.get('http://localhost:8001/api/v1/recipe/getrecipes');
                setRecipes(response.data); // Assuming response.data contains recipe details

                const response2=await axios.get('')
            } catch (error) {
                console.error('Error fetching recipes:', error);
                // Handle error fetching data
            }
        };

        fetchAllRecipes();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Recipe Sharing Platform</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <p className="text-xl">Welcome to the Recipe Sharing Platform!</p>
                    <p className="text-gray-600">Here you can view recipes, photos, and connect with friends.</p>
                </div>
                {userProfile && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">User Profile</h2>
                        <div className="flex items-center">
                            <img className="w-12 h-12 rounded-full mr-4" src={userProfile.profilePicture} alt={userProfile.username} />
                            <div>
                                <p className="font-bold">{userProfile.username}</p>
                                <p className="text-gray-600">{userProfile.email}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.length > 0 && recipes.map(recipe => (
                        <div key={recipe._id} className="bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <img className="w-10 h-10 rounded-full mr-4" src={recipe.author.profilePicture} alt={recipe.author.username} />
                                <div>
                                    <p className="font-bold">{recipe.author.username}</p>
                                    <p className="text-gray-600 text-sm">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <img className="w-full rounded-lg mb-4" src={recipe.imageUrl} alt={recipe.title} />
                            <div>
                                <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                                <p className="text-gray-700 mb-4">{recipe.description}</p>
                                <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                                <p><strong>Instructions:</strong> {recipe.instructions}</p>
                                <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                                <p><strong>Cuisine Type:</strong> {recipe.cuisineType}</p>
                                <p><strong>Dietary Restrictions:</strong> {recipe.dietaryRestrictions.join(', ')}</p>
                            </div>
                            {recipe.videoUrl && (
                                <video className="w-full mt-4" src={recipe.videoUrl} controls></video>
                            )}
                            <div className="mt-4 flex justify-between items-center">
                                <p><strong>Comments:</strong> {recipe.comments.length}</p>
                                <p><strong>Likes:</strong> {recipe.likes.length}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
        

    );
};

const styles = {
    background: {
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #ccc',
        width: '100%',
    },
    container: {
        padding: '20px',
        width: '80%',
        textAlign: 'center',
    },
    intro: {
        marginBottom: '20px',
    },
    profile: {
        marginBottom: '20px',
    },
    recipeContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        justifyItems: 'center',
    },
    card: {
        border: '1px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        maxWidth: '300px',
    },
    recipeImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    cardContent: {
        padding: '15px',
    },
    authorInfo: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
    },
    authorImage: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px',
    },
    video: {
        width: '100%',
        marginTop: '10px',
    },
};

export default MainHomePage;




// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useState,useEffect } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// const MainHomePage = () => {

    
//         const [recipes, setRecipes] = useState(null);
       
    
//         useEffect(() => {
//             const fetchAllRecipes = async () => {
//                 try {
//                     const jwtToken = localStorage.getItem('jwtToken');
//                     axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
//                     console.log(jwtToken)
//                     const response = await axios.get(`http://localhost:8001/api/v1/recipe/getrecipes`);
//                     setRecipes(response.data); // Assuming response.data contains user details
//                     console.log(response)
//                 } catch (error) {
//                     console.error('Error fetching recipes:', error);
//                     // Handle error fetching data
//                 }
//             };
    
//             fetchAllRecipes();
//         }, []);
    
//         // if (!userProfile) {
//         //     return <div>Loading...</div>; // Placeholder for loading state
//         // }
    
      
    




//     // Generate URL with userId as a parameter
//     // const profileLink = `/profile`;

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
//                 <h1>Social Media Home</h1>
                
//                 {/* Link to profile page with userId parameter
//                 <Link to={profileLink} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none' }}>Profile</Link> */}
//             </div>
//             <div style={{ padding: '20px' }}>
//                 {/* Your main content goes here */}
//                 <p>Welcome to the Social Media Home Page!</p>
//                 <p>Here you can view posts, photos, and connect with friends.</p>
//             </div>
//         </div>
//     );
// };

// export default MainHomePage;

