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
 *  rating: number,
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

    clone.querySelector("[data-rating]").innerHTML = data.rating
    clone.querySelector("[data-members]").innerHTML = data.members
    return clone
}

function createList(container) {
    const ANIME_LIST = [];
    const allAnime = container.querySelectorAll(".di-ib.clearfix h3 a");
    const allPosters = container.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8 img");
    const allScores = container.querySelectorAll(".score.ac.fs14 span");
    const allURL = container.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8");

    for (let i = 0; i < allAnime.length; i++) {
        const data = {
        title: allAnime[i].innerHTML,
        posterURL: allPosters[i].getAttribute("src"),
        rating: parseFloat(allScores[i].innerHTML),
        season: "Fall 2016",
        members: "1.5M",
        URL: allURL[i].getAttribute("href")
        };

        ANIME_LIST.push(data);
    }

    return ANIME_LIST;
}

function addCards(){
    fetch('http://localhost:3000/fetchHTML')
        .then(response => response.text()) 
        .then(text => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;

            // const allAnime = tempDiv.querySelectorAll(".di-ib.clearfix h3 a");
            // const allPosters = tempDiv.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8 img");
            
            // console.log([...allAnime].map(x => x.innerHTML))
            // console.log(allPosters)
            animeList = createList(tempDiv);
            console.log(animeList)
            for(let i = 0; i < animeList.length; ++i){
                const card = createCard(i + 1, animeList[i])
                main.append(card)
            };
        })
        .catch(error => {
          console.error('Error:', error);
        });
}

addCards()


// /** @type {Data[]} */
// const FILM_LIST = [
//     {
//         title: "Oppenheimer",
//         posterURL: "https://cinemags.org/wp-content/uploads/2023/05/Oppenheimer-poster.jpg",
//         rating: 9.09,
//         season: "Fall 2016",
//         members: "1.5M",
//         URL: "https://google.com"
//     },
//     {
//         title: "Barbie",
//         posterURL: "https://deadline.com/wp-content/uploads/2023/04/barbie-BARBIE_VERT_TSR_W_TALENT_2764x4096_DOM_rgb.jpg?w=800",
//         rating: 9.05,
//         season: "Summer 2023",
//         members: "1.0M",
//         URL: "https://google.com"
//     },
//     {
//         title: "Breaking Bad",
//         posterURL: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
//         rating: 9.37,
//         season: "Winter 2008",
//         members: "2.7M",
//         URL: "https://google.com"
//     }
// ].sort((a, b) => b.rating - a.rating)

