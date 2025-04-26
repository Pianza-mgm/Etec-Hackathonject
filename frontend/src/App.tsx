import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/user', form);
      setMessage(res.data.message);
      handleRequest();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erro no registro');
    }
  };

  const [users, setUsers] = useState<any>([]);
  const handleRequest = async() => {
    try{
      var response = await axios.get('http://localhost:3000/api/get/users');
      setUsers(response.data);
    }catch(err : any){
      setMessage(err.response?.data?.message || 'Erro no resgate');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //configura um evento de qnd o usuario modificar o input
    setForm({ ...form, [e.target.name]: e.target.value }); //pega os valores anteriores e atualiza um novo { [campo] : valor }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Senha" onChange={handleChange} />
        <button type="submit">Registrar</button>
        {message && <p>{message}</p>}
      </form>
      <button onClick={handleRequest}>Ver Registros</button>
      {users.map((user : any) => (
        <div key={user.id}>
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
