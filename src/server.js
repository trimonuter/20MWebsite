import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

// App and Middleware
const app = express();
app.use(cors());

// Routes
app.get('/anime', (req, res) => {
    const dat = {data: animeList};
    res.json(dat);
})

app.get('/test', (req, res) => {
    const dat = {data: "Tes Fetch"};
    res.json(dat);
})

// Helper functions
// Freeze code for a certain duration (in miliseconds)
async function freeze(ms){
    await new Promise(resolve => setTimeout(resolve, ms));
}

function formatNumber(num) {
if (num >= 1000000) {
    const round = num / 1000000;
    return `${round.toFixed(1)}M`;

} else if (num >= 10000) {
    const round = num / 1000;
    return `${round.toFixed(0)}K`;

} else if (num >= 1000) {
    const round = num / 1000;
    return `${round.toFixed(1)}K`;

} else {
    return `${num}`;
}
}

// Format season string
function formatSeason(dat) {
if (dat.season) {
    return `${dat.season} ${dat.year}`
}
else {
    const airedOn = dat.aired.prop.from;
    let season;
    switch (true) {
        case airedOn.month < 4:
            season = 'Winter';
            break;
        case airedOn.month < 7:
            season = 'Spring';
            break;
        case airedOn.month < 10:
            season = 'Summer';
            break;
        case airedOn.month < 13:
            season = 'Fall';
    }

    return `${season} ${airedOn.year}`
}
}

// Fetch a URL and return response.data
async function fetchData(url) {
const res = await fetch(url);
const resJSON = await res.json();
const data = resJSON.data;

return data;
}

// Main Program
let currentPage = 0;
let currentRank = 0;
let noSequel = 0;
let iterationDelay = 400;
let revert;

let animeList = [];
(async () => {
    while (true) {
        // Array of anime data, each data is an object
        let data = await fetchData(`https://api.jikan.moe/v4/top/anime?page=${currentPage + 1}`);
        data = data.sort((a, b) => a.rank - b.rank)
        
        // console.log(data);
        console.log('running')
        
        // Iterate through every object in data
        for (const x of data) {
        console.log(x.rank);
        // console.log('ok')
        await pushSingleAnimeData(x, animeList);
    
        // Freeze requests for 0.4 seconds (1 second after 60 requests)
        await new Promise(res => setTimeout(res, iterationDelay))
    
        // Change delay from 0.4s to 0.75s after 60 requests
        if (x.rank % 60 === 0) {
            revert = x.rank + 35;
            await new Promise(res => setTimeout(res, 10000))
            iterationDelay = 750;
        }
        // Change delay from 0.75s to 0.45s after 30 requests
        if (x.rank === revert) {
            iterationDelay = 450
        }
        }
    
        // Add cards to HTML page
        // func(previousList => [...previousList, ...animeList])
        currentPage += 1;
    
        // Freeze 1 second before fetching new page
        await new Promise(res => setTimeout(res, 1000))
    }
})()

async function pushSingleAnimeData(obj, list) {
    const singleAnimeData = await fetchData(`https://api.jikan.moe/v4/anime/${obj.mal_id}/full`);

    const [anilistData, anilistRemaining, anilistStatus] = await fetchAnilist(obj.mal_id);
    console.log(anilistRemaining)
    if (anilistRemaining <= 3) {
        console.log('Nearing anilist rate limit');
        await new Promise(res => setTimeout(res, 7000));
    }

    const relationsValues = Object.values(singleAnimeData.relations).map(obj => obj.relation);
    const isSequel = relationsValues.includes('Prequel') ? true : false;
    noSequel += isSequel ? 0 : 1;
    currentRank += 1;

    const dat = {
        id: obj.mal_id,
        title: obj.title,
        posterURL: obj.images.jpg.image_url,
        score: obj.score.toFixed(2),
        season: formatSeason(obj),
        members: formatNumber(obj.members),
        URL: obj.url,
        isSequel: isSequel,
        noSequelRank: isSequel ? ' -' : noSequel,
        popularity: obj.popularity,
        highPopularity: obj.members > 700000,
        tags: !(anilistStatus === 404) ? anilistData.tags : [],
        synonyms: !(anilistStatus === 404) ? [...(Object.values(anilistData.title)), ...(anilistData.synonyms)] : []
    }

    // console.log(dat.synonyms)
    // list.push(<CardContainer rank={currentRank} data={dat}/>);
    list.push(dat);
    // console.log(animeList)
}

async function fetchAnilist(id) {
const query = `
query {
    Media (idMal: ${id}, type: ANIME) {
    id
    title {
        romaji
        english
        native
    }
    synonyms
    tags {
        name
        description
        category
        rank
    }
    }
}
`
const url = 'https://graphql.anilist.co';
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query,
    })
}

const res = await fetch(url, options);
const remaining = res.headers.get('X-RateLimit-Remaining');
const status = res.status

const dat = await res.json();
return [dat.data.Media, remaining, status];
}

// Listening
app.listen(5000, () => {
    console.log('Server is running on port 5000')
})