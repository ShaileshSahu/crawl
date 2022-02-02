import {fetchNewsController} from '../controller/new.controller.js';

function NewRouter(fastify,option,done) {
    
    fastify.get('/', fetchNewsController);
    done();
}

export default NewRouter;