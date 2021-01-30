fetch('https://rickandmortyapi.com/api/character')
.then((data) => {
    return data.json();
})
.then((characters) => {
    const cardsContainer = document.querySelector('.cards-container')
    cardsContainer.innerHTML = ``
    
    characters.results.map((character) => {
        cardsContainer.innerHTML +=
        `<article class="character-card" >
            <div class="character-card__image-container">
                <img class="character-card__image" src="${character.image}"/>
            </div>
            <div class="character-card__name-container">
                <h3 class="character-card__name">${character.name}</h3>
            </div>
        </article>`
    })
})