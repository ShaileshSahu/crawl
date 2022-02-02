
import cheerio from 'cheerio';
import  got from 'got';
import NodeCache from 'node-cache';
const cache = new NodeCache(); 
const TTL = 1000;
const fetchApi = (url) => {
    return got.get(url);
};

const fetchNews = async () => {
    const details = await Promise.resolve(fetchApi('https://www.hindustantimes.com'));
    const $ = cheerio.load(details.body);
    const news = retreiveNews($);
    cache.set('news', JSON.stringify(news),TTL);
    return news;
};
const retreiveNews = ($) => {
    try {
        const news = [];
        $('body').find('section .mainContainer').each((index, row) => {
            $(row).find('section .worldSection').each((i, detail) => {
                     $(detail).find('.cartHolder').each((articleIndex, articleData) => {
                            let imgReal = '';
                            $(articleData).find('figure span').each((imgI, imgR) => {
                                imgReal = $(imgR).find('img').attr('src');
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
                    });
                
            });
        });
        return news;
    } catch (error) {
        return Promise.reject();
    }
};


export const fetchNewsController = async (request,reply) => {
    const data = cache.has('news') ? JSON.parse(cache.get('news')): await fetchNews(); 
    return {data};
};

cache.on('expired', function(key,value){
        fetchNews();
});