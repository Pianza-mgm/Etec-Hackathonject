import express, { Express, Router, Request, Response } from 'express';
const app : Express = express();

import { PrismaClient } from '@prisma/client';
const prisma : PrismaClient = new PrismaClient();

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT: Number = Number(process.env.PORT) || 3000;
const JWT_SECRET = 'é_a_prr_do_Lorax';

//Sign In User
app.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email já registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar usuário.', error });
    }
});


// Login
app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: { email: email, password : password },
        select: {id: true, name: true, email: true}
    });
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Criar um token JWT
    const token = jwt.sign({ id: user.id, username: user.name }, JWT_SECRET, {
        expiresIn: '1h',
    });
    // Enviar o token em um cookie HttpOnly
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true se estiver usando https
        sameSite: 'lax',
    });
    return res.json({ message: 'Login bem-sucedido' });
});
// Logout
app.post('/logout', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logout realizado' });
});
// Get current user data
app.get('/profile', (req, res) => {
    const token = req.cookies.token; //resgatar o token
    if (!token) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); //verificação e dps envio como JSON
        return res.json({ message: 'Perfil do usuário', user: decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});


//Get Users From DB
app.get('/get/users', async (req : Request, res : Response) => {
    try{
        var users = await prisma.user.findMany({
            select: {id: true, name: true, email: true}
        });
        return res.status(200).json(users)
    }catch(err : any){
        return res.status(500).json({ message: 'Erro ao buscar usuários!', err})
    }
});

app.listen(PORT, () => {
    console.log(`The server is running in ${PORT}`);
})