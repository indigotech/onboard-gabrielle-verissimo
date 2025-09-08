import Fastify from 'fastify';

const app = Fastify({ logger: true })

app.get('/hello', () => {
  return 'hello, world';
})

app.listen({ port: 8080 }).then(() => {
  console.log('Acessar http://localhost:8080/hello');
})