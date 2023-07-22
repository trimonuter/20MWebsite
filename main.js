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

/** @type {Data[]} */
const FILM_LIST = [
    {
        title: "Oppenheimer",
        posterURL: "https://cinemags.org/wp-content/uploads/2023/05/Oppenheimer-poster.jpg",
        rating: "9.09",
        season: "Fall 2016",
        members: "1.5M",
        URL: "https://google.com"
    },
    {
        title: "Barbie",
        posterURL: "https://deadline.com/wp-content/uploads/2023/04/barbie-BARBIE_VERT_TSR_W_TALENT_2764x4096_DOM_rgb.jpg?w=800",
        rating: "9.05",
        season: "Summer 2023",
        members: "1.0M",
        URL: "https://google.com"
    }
]

for(let i = 0; i < FILM_LIST.length; ++i){
    const card = createCard(i + 1, FILM_LIST[i])
    main.append(card)
}
