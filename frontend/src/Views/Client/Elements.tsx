import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './Elements.css';


function App() {
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
                setUser(response.data.user);
            } catch {
                window.location.href = '/index.html';
            }
        })();
    }, []);

    if (!user) return null; // ou loading spinner

    return (
        <>
            <Header user={user} />
            <Profile user={user} id='main'/>
            <Footer />
        </>
    );
}

function Header({ user }: { user: any }) {
    return (
        <header>
            <div className="content" id='logo-container'>
                <div id="logo"></div>
                <h3 id='username'>Olá, {user?.username}!</h3>
            </div>
            <div className="content">
                <ul>
                    <li><a href="/src/Views/Client/Main/index.html">Main</a></li>
                    <li><a href="/src/Views/Client/Books/index.html">Catálogo</a></li>
                    <li><a href="/src/Views/SignUp/index.html">Clubes</a></li>
                    <li><button onClick={async () => {
                        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
                        window.location.href = '/index.html';
                    }}>Log Out</button></li>
                </ul>
            </div>
        </header>
    );
}

function Profile({ user, ...props }: { user: any } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div id="main" {...props}>
            <div id="wrapper">
                <div className="content" id='first-content'>
                    <div className="section" id='identification-section'>
                        <div id="profile-pic-container"></div>
                        <h3 id="user-id">ID: {user?.id}</h3>
                    </div>
                    <div className="section" id='basic-data-section'>
                        <div id="input-container">
                            <p>Nome: {user?.username}</p>
                            <p>Email: {user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="content" id='second-content'>
                    <div className="info-container">
                        <div className="content-wrapper">
                            <div id="ranking-container">
                                <p>Ranking:</p>
                                <p id='rank-info'></p>
                            </div>
                            <p>Taxa de Atenção: {user?.atention_rate ?? '0'}%</p>
                        </div>
                    </div>
                    <div className="info-container" id="list-container">
                        <div id="container">
                            <p id="dropdown">Livros Lidos: <div id="arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></div> </p>
                            <div id="dropdown-content">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer>
            {/* seu conteúdo aqui */}
        </footer>
    );
}

// Render único para o App
createRoot(document.getElementById('tsx-app')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);