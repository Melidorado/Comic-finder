const showCharactersFromAPI = (url) => {
    fetch(url)
    .then((data) => {
        return data.json();
    })
    .then((characters) => {
        const cardsContainer = document.querySelector('.cards-container')
        const firstPage = document.querySelector("#first-page")
        const previousPage = document.querySelector("#previous-page")
        const nextPage = document.querySelector("#next-page")
        const lastPage = document.querySelector("#last-page")
        const loader = document.querySelector("#loader-container")

        nextPage.onclick = (e) => {
            e.preventDefault()
            if (characters.info.next != null) {
                nextPage.classList.remove("disable-button")
                previousPage.classList.remove("disable-button")
                firstPage.classList.remove("disable-button")
                loader.classList.remove("hidden")
                showCharactersFromAPI(characters.info.next)
                setTimeout(() => {
                    loader.classList.add("hidden")
                },1000)
            }
            else {
                nextPage.classList.add("disable-button")
            }
        }

        previousPage.onclick = (e) => {
            e.preventDefault()
            if (characters.info.prev != null) {
                previousPage.classList.remove("disable-button")
                loader.classList.remove("hidden")
                showCharactersFromAPI(characters.info.prev)
                setTimeout(() => {
                    loader.classList.add("hidden")
                },1000)
            }
            else {
                previousPage.classList.add("disable-button")
            }
        }

        firstPage.onclick = (e) => {
            e.preventDefault()
            if (characters.info.next != "https://rickandmortyapi.com/api/character?page=2") {
                firstPage.classList.remove("disable-button")
                loader.classList.remove("hidden")
                showCharactersFromAPI('https://rickandmortyapi.com/api/character')
                setTimeout(() => {
                    loader.classList.add("hidden")
                },1000)
            }
            else {
                firstPage.classList.add("disable-button")
            }
        }

        lastPage.onclick = (e) => {
            e.preventDefault()
            if (characters.info.prev != "https://rickandmortyapi.com/api/character?page=33") {
                lastPage.classList.remove("disable-button")
                loader.classList.remove("hidden")
                showCharactersFromAPI("https://rickandmortyapi.com/api/character?page=34")
                setTimeout(() => {
                    loader.classList.add("hidden")
                },1000)
            }
            else {
                lastPage.classList.add("disable-button")
            }
        }


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
}

showCharactersFromAPI('https://rickandmortyapi.com/api/character')