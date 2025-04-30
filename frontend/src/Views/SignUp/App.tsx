import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

function App() {

    const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
    const [message, setMessage] = useState('');
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        try {
            if(form.password === form.passwordConfirm){
                const res = await axios.post('http://localhost:3000/signup', form, {withCredentials: true});
                await axios.post('http://localhost:3000/login', res.data, { withCredentials: true })
                window.location.href = '../Client/Main/index.html'
            }else{
                setMessage('Senhas Incongruentes');
            }
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Erro no registro');
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
            <input type="password" name="passwordConfirm" placeholder="Confirme a Senha" onChange={handleChange} />
            <button type="submit">Registrar-se</button>
            {message && <p id='msg'>{message}</p>}
        </form>
    );
}

createRoot(document.getElementById('form-container')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);