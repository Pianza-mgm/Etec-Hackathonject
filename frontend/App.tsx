import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

function App() {
    const HandleClick = async() => {
        try{
            var userData = await axios.get('http://localhost:3000/profile', { withCredentials: true });
            window.location.href = '/src/Views/Client/Main/index.html';
        }
        catch{
            window.location.href = '/src/Views/LogIn/index.html';
        }
    }
    return(
        <div onClick={HandleClick}>Começar</div>
    )
}
createRoot(document.getElementById('tsx-btn')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)