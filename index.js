import  fastifyT from 'fastify';
import NewsRouter from './router/news.router.js';
import fastifyCors  from 'fastify-cors';
const fastify = fastifyT({logger:true});
fastify.register(fastifyCors);
fastify.register(NewsRouter);
const PORT = process.env.PORT || 4500;
fastify.listen(PORT, "0.0.0.0", ()=>{
    console.log('Server start running', PORT);
});