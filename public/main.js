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
async function getTopAnimeData(page) {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    const resJSON = await res.json();
    data = resJSON.data;

    animeData = [];
    data.forEach(x => {
        const dat = {
            id: x.mal_id,
            title: x.title,
            posterURL: x.images.jpg.image_url,
            score: x.score.toFixed(2),
            season: formatSeason(x),
            members: formatNumber(x.members),
            URL: x.url
        }

        animeData.push(dat);
    });

    return animeData;
}

// ~~~~~~~~~~ Add cards from data ~~~~~~~~~~
let isRunning = false;
let currentRank = 1;
let currentPage = 0;

function addData() {
    if (isRunning) { // If function is already running, don't start a new async operation 
        return;
    }
    // If function isn't already running, start code
    isRunning = true;
    currentPage += 1;
    getTopAnimeData(currentPage)
        .then(dat => {
            for (i = 0; i < dat.length; i++) {
                const card = createCard(currentRank, dat[i]);
                main.append(card);
                currentRank += 1
            }
            isRunning = false
        })
}

// ~~~~~~~~~~ Add more data when scrolling ~~~~~~~~~~
const body = document.querySelector('body');
addData(currentPage)

window.addEventListener('scroll', checkScroll); // Check user scroll
function checkScroll() {
    const scrollHeight = document.documentElement.scrollHeight; // Total height of the entire page, including not shown on screen
    const scrollY = window.scrollY; // Total distance scrolled
    const clientHeight = document.documentElement.clientHeight; // Total height of user window screen

    const userPosition = scrollY + clientHeight;
    if (userPosition + 2500 >= scrollHeight) {
        console.log('running')
        addData(currentPage);
    }
}

// ===================== Event Listeners =====================
toggleSequels = document.getElementById('toggle-sequels');
tsColor = 'red'
toggleSequels.addEventListener('click', () => {
    if (tsColor === 'red') {
        toggleSequels.style.backgroundColor = 'green';
        toggleSequels.style.color = 'white'
        toggleSequels.style.border = '5px solid green';
        tsColor = 'green'

        toggleSequels.textContent = 'Sequels: disabled';
    } else {
        toggleSequels.style.backgroundColor = 'red';
        toggleSequels.style.color = 'white';
        toggleSequels.style.border = '5px solid red';
        tsColor = 'red'

        toggleSequels.textContent = 'Sequels: enabled';
    }
})