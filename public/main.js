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
    // if(data.URL) clone.querySelector("[data-title]").href = data.URL
    clone.querySelector("[data-season]").innerHTML = data.season

    clone.querySelector("[data-score]").innerHTML = data.score
    clone.querySelector("[data-members]").innerHTML = data.members

    clone.querySelector('.no-sequel-rank').textContent = data.isSequel ? '# -' : `#${data.noSequelRank}`
    clone.querySelector('.sequel-rank').textContent = `#${rank}`
    clone.querySelector('.popularity').textContent = `#${data.popularity}`
    
    clone.querySelector('.card').dataset.isSequel = data.isSequel
    clone.querySelector('.card').dataset.nosequelRank = data.noSequelRank
    clone.querySelector('.card').dataset.sequelRank = rank

    // Card clicked event listener
    const dropdown = clone.querySelector('.card-dropdown');
    clone.querySelector('.card').addEventListener('click', () => {
        console.log('clicked')
        dropdown.style.maxHeight = dropdown.style.maxHeight === '0px' ? `${dropdown.scrollHeight}px` : dropdown.style.maxHeight === '' ? `${dropdown.scrollHeight}px`: '0px';
    })

    // Dropdown opened by default for highest ranked anime
    if (rank === 1) {
        dropdown.style.maxHeight = '90px';
    }

    // Green title for non-sequel entries
    const cardRank = clone.querySelector('[data-rank]');
    const titleContainer = clone.querySelector('.title-container')
    const dropdownNSR = clone.querySelector('[data-nsr]');
    if (!data.isSequel) {
        cardRank.style.color = '#39FF14';
        titleContainer.style.color = '#39FF14';
        dropdownNSR.style.color = '#39FF14';

        // dropdown.style.maxHeight = '90px';
    }

    // Yellow score for high popularity anime
    const scoreContainer = clone.querySelector('.score-container');
    const dropdownPopularity = clone.querySelector('[data-p]');
    if (data.highPopularity) {
        scoreContainer.style.color = 'yellow';
        dropdownPopularity.style.color = 'yellow';
    }
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

// Fetch a URL and return response.data
async function fetchData(url) {
    const res = await fetch(url);
    const resJSON = await res.json();
    const data = resJSON.data;

    return data;
}

// Freeze code for a certain duration (in miliseconds)
async function freeze(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

// ===================== Main program =====================
// ~~~~~~~~~~ Get top anime data ~~~~~~~~~~
let animeData = {};
let iterationDelay = 400;
let incorrectRankEntries = [43608];
let noSequel = 0;
let currentPage = 0;
let revert;

let cardList = document.querySelectorAll('.card');
let toggleSequels = document.getElementById('toggle-sequels');
let tsColor = 'red';
let showSequels = true;

let toggleDropdown = document.getElementById('toggle-dropdown');
let tddColor = '#FF5F1F';

// Main code for fetching anime data
(async () => {
    while (currentPage <= 10) {
        // Array of anime data, each data is an object
        const data = await fetchData(`https://api.jikan.moe/v4/top/anime?page=${currentPage + 1}`);
        console.log(data);

        // Iterate through every object in data
        for (const x of data) {
            // console.log(x.rank);
            await pushSingleAnimeData(x);

            // Freeze requests for 0.4 seconds (1 second after 60 requests)
            await freeze(iterationDelay);

            // Change delay from 0.4s to 0.75s after 60 requests
            if (x.rank % 60 === 0) {
                revert = x.rank + 35;
                await freeze(10000);
                iterationDelay = 750;
            }
            // Change delay from 0.75s to 0.45s after 30 requests
            if (x.rank === revert) {
                iterationDelay = 450
            }
        }

        // Add cards to HTML page
        appendCards();
        currentPage += 1;

        // Freeze 1 second before fetching new page
        await freeze(1000);
    }
})();

// Push anime data to animeData object
async function pushSingleAnimeData(obj) {
    const singleAnimeData = await fetchData(`https://api.jikan.moe/v4/anime/${obj.mal_id}/full`);
    const relationsValues = Object.values(singleAnimeData.relations).map(obj => obj.relation);

    const isSequel = relationsValues.includes('Prequel') ? true : false;

    const dat = {
        id: obj.mal_id,
        title: obj.title,
        posterURL: obj.images.jpg.image_url,
        score: obj.score.toFixed(2),
        season: formatSeason(obj),
        members: formatNumber(obj.members),
        URL: obj.url,
        isSequel: isSequel,
        noSequelRank: 0,
        popularity: obj.popularity,
        highPopularity: obj.members > 700000
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
function appendCards() {
    const keyStart = (25 * currentPage) + 1;
    const keyEnd = 25 * (currentPage + 1)
    // console.log(Object.keys(animeData))

    // Remove toggle sequels event listener
    if (currentPage > 0) {
        toggleSequels.removeEventListener('click', toggleSequelsFunction);
        toggleDropdown.removeEventListener('click', toggleDropdownFunction)
    }
    // Add cards to main
    for (i = keyStart; i <= keyEnd; i++) {
        if (Object.keys(animeData).includes(`${i}`)) {
            // Counter for no-sequel rank
            noSequel += animeData[i].isSequel ? 0 : 1;
            animeData[i].noSequelRank = noSequel

            const card = createCard(i, animeData[i]);
            main.append(card);
        }
    }

    // Update toggle sequels event listener
    cardList = document.querySelectorAll('.card');
    toggleSequels.addEventListener('click', toggleSequelsFunction)
    toggleDropdown.addEventListener('click', toggleDropdownFunction)

    console.log(animeData)
}

// ===================== Event Listeners =====================
function toggleSequelsFunction() {
    tsColor = tsColor === 'red' ? 'green' : 'red';
    
    // Toggle button color
    toggleSequels.style.backgroundColor = `${tsColor}`;
    toggleSequels.style.color = 'white';
    toggleSequels.style.border = `5px solid ${tsColor}`;
    
    // Toggle button text
    toggleSequels.textContent = tsColor === 'red' ? 'Sequels: enabled' : 'Sequels: disabled'
    
    console.log('toggled');
    showSequels = !showSequels;
    console.log(showSequels)
    cardList.forEach(card => {
        const dropdown = card.nextElementSibling;

        card.querySelector('.rank').textContent = showSequels ? card.dataset.sequelRank : card.dataset.nosequelRank;
        if (card.dataset.isSequel === 'true') {
            card.style.display = showSequels ? 'flex' : 'none';
            dropdown.style.display = showSequels ? 'flex' : 'none';
        }
    })
}

function toggleDropdownFunction() {
    tddColor = tddColor === '#FF5F1F' ? '#70ff83' : '#FF5F1F';
    
    // Toggle button color
    toggleDropdown.style.backgroundColor = `${tddColor}`;
    toggleDropdown.style.color = 'white';
    toggleDropdown.style.border = `5px solid ${tddColor}`;
    
    // Toggle button text
    toggleDropdown.textContent = tddColor === '#FF5F1F' ? 'Dropdowns: collapsed' : 'Dropdowns: expanded'

    console.log('toggled');
    const disable = tddColor === '#FF5F1F';
    cardList.forEach(card => {
        const dropdown = card.nextElementSibling;
        dropdown.style.maxHeight = disable ? '0px' : '90px';
    })
}