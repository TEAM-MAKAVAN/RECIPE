import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for fadeIn
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Container for the entire Home page
const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ff9966, #ff5e62);
  font-family: 'Arial', sans-serif;
  margin: 0; /* Reset margin */
  padding: 0; /* Reset padding */
`;

// Hero section with animation and styles
const HeroSection = styled.header`
  text-align: center;
  color: white;
  padding: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 1.5s ease-in-out;
  max-width: 600px;
  margin: 0; /* Reset margin */
`;

// Content inside the Hero section
const HeroContent = styled.div`
  h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
  }

  p {
    font-size: 1.2em;
    margin-bottom: 1em;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1em;
  }

  .btn {
    padding: 10px 20px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &.btn-primary {
      background: #ff5e62;
      color: white;
    }

    &.btn-primary:hover {
      background: #e14e56;
    }

    &.btn-secondary {
      background: #ff9966;
      color: white;
    }

    &.btn-secondary:hover {
      background: #e1885b;
    }
  }
`;

// Functional component for the Home page
const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to RecipeShare</h1>
          <p>Discover and share amazing recipes from around the world.</p>
          <div className="buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/Register" className="btn btn-secondary">Sign Up</Link>
            <Link to="/Profile" className="btn btn-secondary">Profile</Link>
          </div>
        </HeroContent>
      </HeroSection>
    </HomeContainer>
  );
}

export default Home;
