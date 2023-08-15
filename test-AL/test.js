let query = `
query {
    Media (id: 15125, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
    }
}
`
let url = 'https://graphql.anilist.co';
let options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query,
    })
}

const textbox = document.getElementById('textbox');
fetch(url, options)
    .then(res => res.json())
    .then(dat => {
        const datString = JSON.stringify(dat);
        console.log(datString);
        textbox.textContent = datString;
    })