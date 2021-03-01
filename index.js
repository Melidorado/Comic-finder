const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = 'fe90364a19b7f147e6c8d3fead703e80';
const cardsContainer = document.querySelector('.cards-container')
const comicInfoContainer = document.querySelector('.comic-information__container')

const resultsContainer = document.querySelector('.results-container')

const loader = document.querySelector("#loader-container")

const firstPage = document.querySelector("#first-page")
const previousPage = document.querySelector("#previous-page")
const nextPage = document.querySelector("#next-page")
const lastPage = document.querySelector("#last-page")

let currentPage = 0
const resultsPerPage = 20
let totalQuantityOfCollection = ''
const noInfoAvailableMessage = 'No disponible'

const checkInputSearch = () => {
    if (inputSearch.value !== "") {
        return inputSearch.value
    }
}

nextPage.onclick = () => {
    currentPage ++
    showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkInputSearch())
}

previousPage.onclick = () => {
    currentPage --
    showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkInputSearch())
}

firstPage.onclick = () => {
    currentPage = 0
    showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkInputSearch())
}

lastPage.onclick = () => {
    const remainder = totalQuantityOfCollection % resultsPerPage
    if (remainder > 0) {

        currentPage = (totalQuantityOfCollection - (remainder)) / resultsPerPage
    }
    else {
        currentPage = (totalQuantityOfCollection / resultsPerPage) - 1
    }
    showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkInputSearch())
}


const checkIfThereIsImageInCharacter = comic => {
    return comic.thumbnail.path.endsWith(`image_not_available`)
    ? `./no-pic.jpg`
    : `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`
}

const showCharactersCards = (character) => {
    return `<article class="character-card" >
         <div class="character-card__image-container">
            <img class="character-card__image" data-id="${character.id}" src="${checkIfThereIsImageInCharacter(character)}"/>
        </div>
        <div class="character-card__name-container">
            <h3 class="character-card__name">${character.name}</h3>
        </div>
    </article>`
}

const checkIfThereIsImageInComic = comic => {
    return comic.images.length 
    ? `${comic.images[0].path}.${comic.images[0].extension}`
    : `./no-pic.jpg`
}
const showComicsCards = (comic) => {
    return `<article class="comic-card">
        <div class="comic-card__image-container">
            <img class="comic-card__image" data-id="${comic.id}" src="${checkIfThereIsImageInComic(comic)}"/>
        </div>
        <div class="comic-card__description-container">
            <p class="comic-card__description">${comic.title}</p>
        </div>    
    </article>`
}

const showInformationFromApi = (collection = "comics", orderBy = "title", inputSearch = null) => {
    let inputParam = ''

    if (inputSearch !== null ) {
        collection == "comics"
        ? inputParam = `&titleStartsWith=${inputSearch}`
        : inputParam = `&nameStartsWith=${inputSearch}`
    }

    fetch(`${baseUrl}${collection}?apikey=${apiKey}&orderBy=${orderBy}${inputParam}&offset=${currentPage * resultsPerPage}`)
    .then(res => res.json())
    .then(information => {
        totalQuantityOfCollection = information.data.total
        resultsContainer.innerHTML = `
            <h2 class="results-container__title">Resultados</h2>
            <h4 class="results-container__total-results">${totalQuantityOfCollection} RESULTADOS</h4>`
        
        console.log(information)

        cardsContainer.innerHTML = ``
        information.data.results.map( comicOrCharacter => {

            if (collection == 'characters') {
                return cardsContainer.innerHTML +=
                showCharactersCards(comicOrCharacter)
                
            }
            if (collection == 'comics') {
                return cardsContainer.innerHTML +=
                showComicsCards(comicOrCharacter)
            }

        });
        let offset = information.data.offset

        if (currentPage == 0) {
            firstPage.disabled = true
            previousPage.disabled = true
            firstPage.classList.add('disable-button')
            previousPage.classList.add('disable-button')
        }
        else{
            firstPage.disabled = false
            previousPage.disabled = false
            firstPage.classList.remove('disable-button')
            previousPage.classList.remove('disable-button')
        }
        if (offset + resultsPerPage > totalQuantityOfCollection) {
            nextPage.disabled = true
            lastPage.disabled = true
            nextPage.classList.add('disable-button')
            lastPage.classList.add('disable-button')
        }
        else {
            nextPage.disabled = false
            lastPage.disabled = false
            nextPage.classList.remove('disable-button')
            lastPage.classList.remove('disable-button')
        }
       
        comicInfoContainer.innerHTML = ``

        const comicCards = document.querySelectorAll('.comic-card')
        const charactersCards = document.querySelectorAll('.character-card')

        comicCards.forEach(card => {
            card.onclick = (e) => {
                comicId = e.target.dataset.id
                cardsContainer.innerHTML = ``
                resultsContainer.innerHTML = ``
                showComicCardInformation(`${baseUrl}${collection}/${comicId}?apikey=${apiKey}`)
            }
        })

        charactersCards.forEach(card => {
            card.onclick = (e) => {
                characterId = e.target.dataset.id
                cardsContainer.innerHTML = ``
                resultsContainer.innerHTML = ``
                showCharacterCardInformation(`${baseUrl}${collection}/${characterId}?apikey=${apiKey}`)
            }
        })
    })    
}

showInformationFromApi()

const showCharacterCardInformation = (url) => {
    fetch(url)
    .then(res => res.json())
    .then(character => {
        console.log(character)
        character.data.results.map( character => {
            const comicInfoContainer = document.querySelector('.comic-information__container')
            comicInfoContainer.classList.remove('hidden')
            comicInfoContainer.innerHTML = ``
            comicInfoContainer.innerHTML =
                    `<div class="comic-information__image">
                        <img src="${checkIfThereIsImageInCharacter(character)}" alt="">
                    </div>
                    <div class="comic-information">
                        <h2>${character.name}</h2>
                        <p>${character.description || "No disponible"}</p>
                    </div>` 
        /* const urlWithCharacters = comic.characters.collectionURI
        showCharactersFromComic(urlWithCharacters) */
    })

})
}

const showComicCardInformation = (url) => {
fetch(url)
.then(res => res.json())
.then(comic => {
    console.log(comic)
    comic.data.results.map( comic => {
        const comicInfoContainer = document.querySelector('.comic-information__container')
        comicInfoContainer.classList.remove('hidden')
        comicInfoContainer.innerHTML = ``
        comicInfoContainer.innerHTML =
                    `<div class="comic-information__image">
                        <img src="${checkIfThereIsImageInComic(comic)}" alt="">
                    </div>
                    <div class="comic-information">
                        <h2>${comic.title}</h2>
                        <h3>Publicado:</h3>
                        <p>18/12/2019</p>
                        <h3>Guionistas:</h3>
                        <p class="writers">${checkIfThereIsWritersInformation(comic)}</p>
                        <h3>Descripción:</h3>
                        <p>${comic.description || "No disponible"}</p>
                    </div>` 
        const urlWithCharacters = comic.characters.collectionURI
        showCharactersFromComic(urlWithCharacters)
    })

})
}

const checkIfThereIsWritersInformation = comic => {
    let creators = comic.creators.items
    return creators.length > 0 && isAWriter(creators)
    ? showComicWriters(comic)
    : noInfoAvailableMessage
}

const isAWriter = creators => {
    return creators.some( creator => {
        return creator.role === 'writer'
    })
}

const showComicWriters = comic => {
    return comic.creators.items.filter(autor => {
        return autor.role === 'writer'
    }).map(writer => {return writer.name})
}
    
const showCharactersFromComic = (url) => {
    fetch(`${url}?apikey=${apiKey}`)
.then(res => res.json())
.then(characters => {
    console.log(characters)
    if (characters.data.results.length > 0) {
    characters.data.results.map( character => {
        console.log(character.name)
        totalQuantityOfCollection = characters.data.total
        resultsContainer.innerHTML = `
            <h2 class="results-container__title">Personajes</h2>
            <h4 class="results-container__total-results">${totalQuantityOfCollection} RESULTADOS</h4>
            `
        return cardsContainer.innerHTML +=
        showCharactersCards(character)
    })}
    else {
        resultsContainer.innerHTML = `
            <h2 class="results-container__title">Personajes</h2>
            <h4 class="results-container__total-results">0 RESULTADOS</h4>
            `
        return cardsContainer.innerHTML = `
        <h2 class="results-container__title">No se han encontrado resultados</h2> 
        `
    }
})
}


const collectionSearch = document.querySelector('#type-search')
const alphabethicNewestSearch = document.querySelector('#alphabetic-newest-search')
const form = document.querySelector('form')
const inputSearch = document.querySelector('#text-search')

collectionSearch.onchange = () => {
    if (collectionSearch.value == 'characters') {
        alphabethicNewestSearch.innerHTML= `
        <option value="name">A-Z</option>
        <option value="-name">Z-A</option>
     `
    }
    else {
        alphabethicNewestSearch.innerHTML= `
        <option value="title">A-Z</option>
        <option value="-title">Z-A</option>
        <option value="-focDate">Mas Nuevos</option>
        <option value="focDate">Mas Viejos</option>
     `
    }
}

form.onsubmit = (e) => {
    e.preventDefault()
    restartPages()
    return inputSearch.value !== ''
    ? showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, inputSearch.value)
    : showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value)
}

const restartPages = () => currentPage = 0






