import cheerio from 'cheerio';
import  got from 'got';
function NewRouter(fastify,option,done) {

    fastify.get('/', async(req,reply)=> {
        let $ = '';
        const data = await got.get('https://www.hindustantimes.com');
        $ = cheerio.load(data.body);
        const news = await retreiveNews($);
        return news;
    });
    done();

}

async function retreiveNews($) {
    try {
        const news = [];
        let index = 0;
        $('body').find('section .mainContainer').each((index, row) => {

            $(row).find('section .worldSection').each((i, detail) => {
                if (true || i == 0) {
                    $(detail).find('.cartHolder').each((articleIndex, articleData) => {
                        if (true || articleIndex == 1) {
                            let imgReal = '';
                            $(articleData).find('figure span').each((imgI, imgR) => {
                                imgReal = $(imgR).find('img').attr('src')
                            });

                            let object = {
                                title: $(articleData).find('.hdg3').text().toString(),
                                type: $(articleData).find('.catName').text(),
                                link: 'https://www.hindustantimes.com/' + $(articleData).find('.hdg3 a').attr('href'),
                                shortStory: $(articleData).find('.sortDec').text().toString(),
                                date: $(articleData).find('.dateTime').text(),
                                imageReal: imgReal,
                                image: $(articleData).find('.lazy').attr('data-src'),
                                dataSource: 'Hindustan Times',
                                id: ++index

                            };
                            news.push(object);
                        }
                    });
                }
            });

        });
        return {data: news};
    } catch (error) {
        return Promise.reject();
    }
}
export default NewRouter;