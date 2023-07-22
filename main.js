/** @type {HTMLTemplateElement} */
const cardTemplate = document.getElementById("card-template")

/** @type {HTMLElement} */
const main = document.getElementById("main")

/**
 * @typedef {{
 *  title: string,
 *  posterURL: string,
 *  rating: number
 * }} Data
 */

/**
 * @param {number} count 
 * @param {Data} data 
 */
function createCard(count, data){
    /** @type {HTMLElement} */
    const clone = cardTemplate.content.cloneNode(true)

    clone.querySelector("[data-count]").innerHTML = count
    clone.querySelector("[data-title]").innerHTML = data.title
    clone.querySelector("[data-poster]").src = data.posterURL
    clone.querySelector("[data-rating]").innerHTML = data.rating
    return clone
}

/** @type {Data[]} */
const FILM_LIST = [
    {
        title: "Oppenheimer",
        posterURL: "https://cinemags.org/wp-content/uploads/2023/05/Oppenheimer-poster.jpg",
        rating: "9.09"
    },
    {
        title: "Barbie",
        posterURL: "https://deadline.com/wp-content/uploads/2023/04/barbie-BARBIE_VERT_TSR_W_TALENT_2764x4096_DOM_rgb.jpg?w=800",
        rating: "9.05"

    }
]

for(let i = 0; i < FILM_LIST.length; ++i){
    const card = createCard(i + 1, FILM_LIST[i])
    main.append(card)
}
