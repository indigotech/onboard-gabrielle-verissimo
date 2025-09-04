import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/hello', () => {
  return 'hello, world';
})

app.listen({ port: 3000 }).then(() => {
  console.log('Acessar http://localhost:3000/hello');
})