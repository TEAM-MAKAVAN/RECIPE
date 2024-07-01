import React, { useState } from 'react';
import axios from 'axios';

const LikeButton = ({ recipeId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [error, setError] = useState(null);

    const handleLike = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                throw new Error('User not authenticated');
            }

            const response = await axios.post(
                `http://localhost:8001/api/v1/Like/addLikes/${recipeId}`,
                {},
                {
                    withCredentials: true, // Send cookies
                    headers: {
                        Authorization: `Bearer ${jwtToken}` // Optionally add authorization header
                    }
                }
            );

            setIsLiked(true);
            console.log(response.data); // Optionally, handle response if needed
        } catch (error) {
            console.error('Error liking recipe:', error);
            setError('Error liking recipe. Please try again later.');
        }
    };

    return (
        <div>
            <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLiked ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleLike}
                disabled={isLiked}
            >
                {isLiked ? 'Liked!' : 'Like'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default LikeButton;
