import { FastifyRequest, FastifyReply } from 'fastify';

interface ReqUser {
    name: string;
    email: string;
    password: string;
    birthDate: Date;
}

interface ResUser{
    id: string;
    name: string;
    email: string;
    password: string;
    birthDate: Date;
}

export async function createUser (request: FastifyRequest<{ Body: ReqUser }>, reply: FastifyReply) {
    const user = request.body;
    const rep:ResUser = {id:'1', ...user};

    reply.send(rep);
}
