/** @type {HTMLTemplateElement} */
const cardTemplate = document.getElementById("card-template")

/** @type {HTMLElement} */
const main = document.getElementById("main")

/**
 * @typedef {{
 *  URL: string,
 *  posterURL: string,
 *  title: string,
 *  season: string,
 *  score: number,
 *  members: string
 * }} Data
 */

/**
 * @param {number} count 
 * @param {Data} data 
 */
function createCard(rank, data){
    /** @type {HTMLElement} */
    const clone = cardTemplate.content.cloneNode(true)

    clone.querySelector("[data-rank]").innerHTML = rank
    clone.querySelector("[data-poster]").src = data.posterURL

    clone.querySelector("[data-title]").innerHTML = data.title
    if(data.URL) clone.querySelector("[data-title]").href = data.URL
    clone.querySelector("[data-season]").innerHTML = data.season

    clone.querySelector("[data-score]").innerHTML = data.score
    clone.querySelector("[data-members]").innerHTML = data.members
    
    clone.querySelector('.card').dataset.isSequel = data.isSequel
    clone.querySelector('.card').dataset.nosequelRank = data.noSequelRank
    clone.querySelector('.card').dataset.sequel = rank
    return clone
}
// ===================== Helper Functions =====================
// Function for huge number formatting (M, K)
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

// ===================== Main program =====================
// ~~~~~~~~~~ Get top anime data ~~~~~~~~~~
let maxPage = 0;
let animeData = {};
let iterationDelay = 400;
let incorrectRankEntries = [43608]

// Freeze code for a certain duration (in miliseconds)
async function freeze(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

// Main code for fetching anime data
(async () => {
    maxPage += 1;
    while (maxPage <= 3) {
        // Array of anime data, each data is an object
        const data = await fetchData(`https://api.jikan.moe/v4/top/anime?page=${maxPage}`);
        console.log(data);

        // Iterate through every object in data
        for (const x of data) {
            console.log(x.rank);
            await pushSingleAnimeData(x);

            // Freeze requests for 0.4 seconds (1 second after 60 requests)
            await freeze(iterationDelay);

            // Change delay from 0.4s to 1s after 60 requests
            if (x.rank === 60) {
                await freeze(10000);
                iterationDelay = 1000;
            }
        }

        // Add cards to HTML page
        if (maxPage === 1) {
            appendCards();
        }
        maxPage += 1;

        // Freeze 1 second before fetching new page
        await freeze(1000);
    }
})();

let noSequel = 0;
// Push anime data to animeData object
async function pushSingleAnimeData(obj) {
    const singleAnimeData = await fetchData(`https://api.jikan.moe/v4/anime/${obj.mal_id}/full`);
    const relationsValues = Object.values(singleAnimeData.relations).map(obj => obj.relation);

    const isSequel = relationsValues.includes('Prequel') ? true : false;
    noSequel += isSequel ? 0 : 1;

    const dat = {
        id: obj.mal_id,
        title: obj.title,
        posterURL: obj.images.jpg.image_url,
        score: obj.score.toFixed(2),
        season: formatSeason(obj),
        members: formatNumber(obj.members),
        URL: obj.url,
        isSequel: isSequel,
        noSequelRank: noSequel
    }

    if (incorrectRankEntries.includes(obj.mal_id)) {
        switch (obj.mal_id) {
            case 43608: // Kaguya-sama, Rank 9
                animeData[9] = dat;
                break
        }
    } else {
        animeData[obj.rank] = dat;
    }
}

// Add cards to HTML page
let currentPage = 1;
function appendCards() {
    keyStart = (25 * (currentPage - 1)) + 1;
    keyEnd = 25 * currentPage
    console.log(Object.keys(animeData))

    for (i = keyStart; i <= keyEnd; i++) {
        if (Object.keys(animeData).includes(`${i}`)) {
            const card = createCard(i, animeData[i]);
            main.append(card);
        }
    }
    currentPage += 1; 
}

// // ~~~~~~~~~~ Add more data when scrolling ~~~~~~~~~~
const body = document.querySelector('body');
let isRunning = false;

window.addEventListener('scroll', checkScroll); // Check user scroll
function checkScroll() {
    if (isRunning) {
        return;
    }
    const scrollHeight = document.documentElement.scrollHeight; // Total height of the entire page, including not shown on screen
    const scrollY = window.scrollY; // Total distance scrolled
    const clientHeight = document.documentElement.clientHeight; // Total height of user window screen

    const userPosition = scrollY + clientHeight;
    if (userPosition + 2500 >= scrollHeight) {
        isRunning = true;
        console.log('running');
        appendCards();
    }
}

// Fetch a URL and return response.data
async function fetchData(url) {
    const res = await fetch(url);
    const resJSON = await res.json();
    const data = resJSON.data;

    return data;
}
// // ~~~~~~~~~~ Add cards from data ~~~~~~~~~~
// let isRunning = false;
// let currentRank = 1;

// function addData() {
//     // if (isRunning) { // If function is already running, don't start a new async operation 
//     //     return;
//     // }
//     // // If function isn't already running, start code
//     // isRunning = true;
//     currentPage += 1;
//     getTopAnimeData(currentPage)
//         .then(dat => {
//             for (i = 0; i < dat.length; i++) {
//                 const card = createCard(currentRank, dat[i]);
//                 main.append(card);
//                 currentRank += 1;
//             }
//             isRunning = false;
//         })
// }


// // ===================== Event Listeners =====================
// toggleSequels = document.getElementById('toggle-sequels');
// tsColor = 'red'
// toggleSequels.addEventListener('click', () => {
//     if (tsColor === 'red') {
//         toggleSequels.style.backgroundColor = 'green';
//         toggleSequels.style.color = 'white'
//         toggleSequels.style.border = '5px solid green';
//         tsColor = 'green'

//         toggleSequels.textContent = 'Sequels: disabled';
//     } else {
//         toggleSequels.style.backgroundColor = 'red';
//         toggleSequels.style.color = 'white';
//         toggleSequels.style.border = '5px solid red';
//         tsColor = 'red'

//         toggleSequels.textContent = 'Sequels: enabled';
//     }
//     console.log('toggled')
//     const cardList = document.querySelectorAll('.card');
//     cardList.forEach(card => {
//         card.querySelector('.rank').textContent = card.dataset.nosequelRank
//         if (card.dataset.isSequel === 'true') {
//             card.style.display = 'none';
//         }
//     })
// })