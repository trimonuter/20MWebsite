const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results')

searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';

    if (query.length === 0) {
        return;
    }

    const fakeSearchResults = [
        'Pablo Honey',
        'The Bends',
        'OK Computer',
        'Kid A',
        'Amnesiac',
        'Hail to the Thief',
        'In Rainbows',
        'The King of Limbs',
        'A Moon Shaped Pool'
    ]

    const match = fakeSearchResults.filter(x => x.toLowerCase().includes(query))

    match.forEach(y => {
        const result = document.createElement('div');
        result.textContent = y
        searchResults.appendChild(result)
    })
})