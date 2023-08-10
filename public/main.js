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

// Get top anime data
async function getTopAnimeData() {
    const res = await fetch('https://api.jikan.moe/v4/top/anime');
    const resJSON = await res.json();
    data = resJSON.data;

    animeData = [];
    data.forEach(x => {
        const dat = {
            id: x.mal_id,
            title: x.title,
            posterURL: x.images.jpg.image_url,
            score: x.score,
            season: `${x.season} ${x.year}`,
            members: formatNumber(parseInt(`${x.members}`)),
            URL: x.url
        }

        animeData.push(dat);
    });

    return animeData;
}

// Add cards from data
getTopAnimeData()
    .then(dat => {
        for (i = 0; i < dat.length; i++) {
            const card = createCard(i + 1, dat[i]);
            main.append(card);
        }
    })