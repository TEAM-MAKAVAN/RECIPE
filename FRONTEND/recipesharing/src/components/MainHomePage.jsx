import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import LikeButton from './Likefunction.jsx';

const MainHomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllRecipes = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
                const response = await axios.get('http://localhost:8001/api/v1/recipe/getrecipes', {
                    params: { populateAuthor: true }
                });
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setError('Error fetching recipes. Please try again later.');
            }
        };

        fetchAllRecipes();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Recipe Sharing Platform</h1>
                    </div>
                    <div>
                        {/* Profile Button */}
                        <Link to="http://localhost:5173/Profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Profile
                        </Link>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <p className="text-xl">Welcome to the Recipe Sharing Platform!</p>
                    <p className="text-gray-600">Here you can view recipes, photos, and connect with friends.</p>
                </div>
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.length > 0 ? (
                            recipes.map(recipe => (
                                <div key={recipe._id} className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center mb-4">
                                        <Link to={`/authorprofile/${recipe.author._id}`} className="font-bold text-blue-500 hover:underline">
                                            {recipe.author.username}
                                        </Link>
                                        <p className="text-gray-600 text-sm ml-2">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {recipe.imageUrl && (
                                        <img className="w-full rounded-lg mb-4" src={recipe.imageUrl} alt={recipe.title} />
                                    )}
                                    <div className="px-2">
                                        <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                                        <p className="text-gray-700 mb-4">{recipe.description}</p>
                                        <div className="flex justify-between mb-2">
                                            <p><strong>Ingredients:</strong> {recipe.ingredients.length > 0 ? recipe.ingredients.join(', ') : 'Not specified'}</p>
                                            <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                                            <p><strong>Cuisine Type:</strong> {recipe.cuisineType}</p>
                                        </div>
                                        <p><strong>Dietary Restrictions:</strong> {recipe.dietaryRestrictions.length > 0 ? recipe.dietaryRestrictions.join(', ') : 'None'}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            {/* Integrate LikeButton component */}
                                            <LikeButton recipeId={recipe._id} />
                                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                                Comment ({recipe.comments.length})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <p>No recipes found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainHomePage;
