import express, { Express, Router, Request, Response } from 'express';
const app : Express = express();

import { PrismaClient } from '@prisma/client';
const prisma : PrismaClient = new PrismaClient();

import cors from 'cors';
import bcrypt from 'bcryptjs';
import { log } from 'console';

app.use(express.json());
app.use(cors());
const PORT: Number = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`The server is running in ${PORT}`);
})

app.post('/api/auth/user', async (req: Request, res: Response) => {
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
app.get('/api/get/users', async (req : Request, res : Response) => {
    try{
        var users = await prisma.user.findMany({
            select: {id: true, name: true, email: true}
        });
        return res.status(200).json(users)
    }catch(err : any){
        return res.status(500).json({ message: 'Erro ao buscar usuários!', err})
    }
});