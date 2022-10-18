
import cheerio from 'cheerio';
import  got from 'got';
import NodeCache from 'node-cache';
const cache = new NodeCache(); 
const TTL = 1000;
const fetchApi = (url) => {
    return got.get(url);
};

const fetchNews = async () => {
   
    const news = await retreiveNews();
    // cache.set('news', JSON.stringify(news),TTL);
    return news;
};
const retreiveNews = async () => {
    try {
        const news = [];
        news.push(... await retreiveNewsHT());
        news.push(... await retreiveNewsHTNDTV());

        return news;
    } catch (error) {
        return Promise.reject();
    }
};

const retreiveNewsHTNDTV = async () => {
    const news = []
    let url = "https://www.ndtv.com/latest/page-";
    for(let i =1 ; i<8;i++) {
        let newurl = url + i;
        const data =  await Promise.resolve(fetchApi(newurl))
        const $ = cheerio.load(data.body);
	    let index = 0;
        const selector = "body > div.content > div.container > div > section > div.row.s-lmr.mt-10 > article > div > div > div > div.sp-cn.ins_storybody.lstng_Pg > div > div"		
        $(selector).each( (articleIndex,articleData) => {
            if (  true || articleIndex==1) {
                let object = {
                    title: '',
                    type: '',
                    link: '',
                    shortStory:'',
                    date: '',
                    imageReal:'',
                    image: '',
                    dataSource: '',
                    id: ++index
                };
                $(articleData).children((index,childerenData) => {
                        object.title =  object.title ? object.title : $(childerenData).find('h2').text().toString();
                        object.type = $(childerenData).find('.catName').text() ? $(childerenData).find('.catName').text() : 'Latest';
                        object.link = object.link ? object.link : $(childerenData).find('a').attr('href');
                        object.shortStory = object.shortStory ? object.shortStory : $(childerenData).find('.newsCont').text().toString();
                        object.date = object.date ? object.date : $(childerenData).find('.posted-by').text();
                        object.imageReal =object.imageReal  ? object.imageReal : $(childerenData).find('img').attr('alt');
                        object.image = object.image  ? object.image : $(childerenData).find('img').attr('src');
                        object.dataSource = 'NDTV';
                    }	
                );
                news.push(object);
            }
        });
    }
	return news;	
}

const retreiveNewsHT = async () => {
    const details = await Promise.resolve(fetchApi('https://www.hindustantimes.com'));
    const $ = cheerio.load(details.body);
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
}

export const fetchNewsController = async (request,reply) => {
    const data = cache.has('news') ? JSON.parse(cache.get('news')): await fetchNews(); 
    return {data};
};

cache.on('expired', function(key,value){
        fetchNews();
});