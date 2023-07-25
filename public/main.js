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

async function fetchAnimeData() {
    const response = await fetch("http://localhost:3000/scrape"); // Replace with your backend API endpoint
    const animeList = await response.json();
    return animeList;
  }

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

// /** @type {Data[]} */
// const ANIME_LIST = []

(async () => {
    try {
      const animeList = await fetchAnimeData();
      animeList.sort((a, b) => b.rating - a.rating);
  
      for (let i = 0; i < animeList.length; i++) {
        const card = createCard(i + 1, animeList[i]);
        main.append(card);
      }
    } catch (error) {
      console.error("Error fetching anime data:", error);
    }
  })();