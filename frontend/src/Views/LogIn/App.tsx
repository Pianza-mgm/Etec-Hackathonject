import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

function App() {

    const [form, setForm] = useState({ username: '', email: '', password: '', passwordConfirm: '' });
    const [message, setMessage] = useState('');
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/login', form);
            setMessage(res.data.message);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Algum dado foi inserido incorretamente');
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //configura um evento de qnd o usuario modificar o input
        setForm({ ...form, [e.target.name]: e.target.value }); //pega os valores anteriores e atualiza um novo { [campo] : valor }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nome" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Senha" onChange={handleChange} />
            <button type="submit">Entrar</button>
            {message && <p id='msg'>{message}</p>}
        </form>
    );
}

createRoot(document.getElementById('form-container')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);