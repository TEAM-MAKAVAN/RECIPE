import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode


function SavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const jwtToken = localStorage.getItem('jwtToken'); // Assuming you have stored JWT token in localStorage
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken._id;

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const response2 = await axios.post(
                    `http://localhost:8001/api/v1/recipe/saved-recipes/${userId}`,
                    {},
                    {
                        withCredentials: true, // Send cookies
                        headers: {
                            Authorization: `Bearer ${jwtToken}` // Optionally add authorization header
                        }
                    }
                );
                setSavedRecipes(response2);
                console.log(response2)
            } catch (error) {
                console.error('Error fetching saved recipes:', error);
                // Handle error fetching saved recipes
            }
        };

        fetchSavedRecipes();
    }, [jwtToken]);

    return (
        <div>
            <h2>Saved Recipes</h2>
            {savedRecipes.length === 0 ? (
                <p>No saved recipes found.</p>
            ) : (
                <ul>
                    {savedRecipes.map((recipe) => (
                        <li key={recipe._id}>
                            <strong>{recipe.title}</strong> - {recipe.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SavedRecipes;
