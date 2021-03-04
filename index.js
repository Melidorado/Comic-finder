const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = 'fe90364a19b7f147e6c8d3fead703e80';
const cardsContainer = document.querySelector('.cards-container')
const comicInfoContainer = document.querySelector('.comic-information__container')
const characterInfoContainer = document.querySelector('.character-information__container')

const resultsContainer = document.querySelector('.results-container')

const loader = document.querySelector("#loader-container")

const firstPage = document.querySelector("#first-page")
const previousPage = document.querySelector("#previous-page")
const nextPage = document.querySelector("#next-page")
const lastPage = document.querySelector("#last-page")
const pageOfPages = document.querySelector('.total-pages')

let currentPage = 0
const resultsPerPage = 20
let totalQuantityOfCollection = ''
const noInfoAvailableMessage = 'No disponible'
const auxiliarPicture = `./no-pic.jpg`
let urlWithCharacters = ''
let urlWithComics = ''



const checkIfThereIsImageInCharacter = (comic, size = "") => {
    return comic.thumbnail.path.endsWith(`image_not_available`)
    ? auxiliarPicture
    : `${comic.thumbnail.path}${size}.${comic.thumbnail.extension}`
}

const showCharactersCards = (character) => {
    return `<article class="character-card card" >
         <div class="character-card__image-container">
            <img class="character-card__image" data-id="${character.id}" src="${checkIfThereIsImageInCharacter(character, '/portrait_uncanny')}"/>
        </div>
        <div class="character-card__name-container">
            <h3 class="character-card__name">${character.name}</h3>
        </div>
    </article>`
}

const checkIfThereIsImageInComic = comic => {
    return comic.images.length 
    ? `${comic.images[0].path}.${comic.images[0].extension}`
    : auxiliarPicture
}
const showComicsCards = (comic) => {
    return `<article class="comic-card card">
        <div class="comic-card__image-container">
            <img class="comic-card__image" data-id="${comic.id}" src="${checkIfThereIsImageInComic(comic)}"/>
        </div>
        <div class="comic-card__description-container">
            <p class="comic-card__description">${comic.title}</p>
        </div>    
    </article>`
}

const checkInputSearch = (inputSearch, collection) => {
    let inputParam = ''
    if (inputSearch !== null ) {
        collection == "comics"
        ? inputParam = `&titleStartsWith=${inputSearch}`
        : inputParam = `&nameStartsWith=${inputSearch}`
    }
    else {
       inputParam = ''
    }
    return inputParam
}

const showNumberOfResults = (number, title = 'Resultados') => {
    resultsContainer.innerHTML = `
        <h2 class="results-container__title">${title}</h2>
        <h4 class="results-container__total-results">${number} RESULTADOS</h4>
    `
}

const showInfoInHTML = (info, collection) => {
    cardsContainer.innerHTML = ``
        info.data.results.map( comicOrCharacter => {
            if (collection == 'characters') {
                return cardsContainer.innerHTML +=
                showCharactersCards(comicOrCharacter) 
            }
            if (collection == 'comics') {
                return cardsContainer.innerHTML +=
                showComicsCards(comicOrCharacter)
            }
        });
}

const showCardInformation = (url, collection) => {
    fetch(url)
    .then(res => res.json())
    .then(card => {
        collection === 'comics'
        ? showComicCardInformation(card)
        : showCharacterCardInformation(card)
    })
}

const hideCharacterInfoSection = () => {
    characterInfoContainer.innerHTML = ``
    characterInfoContainer.classList.add('hidden')
}

const showCharacterInfoSection = () => {
    characterInfoContainer.classList.remove('hidden')
}

const hideComicInfoSection = () => {
    comicInfoContainer.innerHTML = ``
    comicInfoContainer.classList.add('hidden')
}

const showComicInfoSection = () => {
    comicInfoContainer.classList.remove('hidden')
}

const chooseCardForDetails = (collection) => {
    const cards = document.querySelectorAll('.card')
    cards.forEach ( card => {
        card.onclick = (e) => {
            id = e.target.dataset.id
            cardsContainer.innerHTML = ``
            resultsContainer.innerHTML = ``
            hideComicInfoSection()
            hideCharacterInfoSection()
            showCardInformation(`${baseUrl}${collection}/${id}?apikey=${apiKey}`, collection)
        }
    })
}

const showInformationFromApi = (collection = "comics", orderBy = "title", inputSearch = null) => {
  
    fetch(`${baseUrl}${collection}?apikey=${apiKey}&orderBy=${orderBy}${checkInputSearch(inputSearch, collection)}&offset=${currentPage * resultsPerPage}`)
    .then(res => res.json())
    .then(information => {
        console.log(information)
        totalQuantityOfCollection = information.data.total
        let offset = information.data.offset
        showNumberOfResults(totalQuantityOfCollection)
        showInfoInHTML(information, collection)
        enableOrDisablePages(offset, totalQuantityOfCollection)
        calculateAllPages()
        chooseCardForDetails(collection)
    })    
}

showInformationFromApi()

const showCharacterCardInformation = (character) => {
    console.log(character)
    character.data.results.map( character => {
        showCharacterInfoSection()
        characterInfoContainer.innerHTML =
        `<div class="character-information__image">
            <img src="${checkIfThereIsImageInCharacter(character)}" alt="">
        </div>
        <div class="character-information">
            <h2>${character.name}</h2>
            <p>${character.description || "No disponible"}</p>
        </div>` 
        urlWithComics = character.comics.collectionURI
        showExtraInfo(urlWithComics, 'characters')
    })
}

const showComicCardInformation = (comic) => {
    console.log(comic)
    comic.data.results.map( comic => {
        showComicInfoSection()
        urlWithCharacters = comic.characters.collectionURI
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
        showExtraInfo(urlWithCharacters, 'comics')
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

const showExtraInfo = (url, collection) => {
    fetch(`${url}?apikey=${apiKey}&offset=${currentPage * resultsPerPage}`)
    .then(res => res.json())
    .then(extraInfo => {
        collection === 'comics'
        ? showCharactersFromComic(extraInfo)
        : showComicsOfCharacter(extraInfo)
    })
}

const checkPages = collection => {
    collection.data.total > 20
    ? ableNextAndLast()
    : disabledPages()
}

const showComicsOfCharacter = comics => {
    checkPages(comics)
    cardsContainer.innerHTML = ``
    comics.data.results.length > 0
    ? showComics(comics)
    :showNoResults()
}
    
const showCharactersFromComic = characters => {
    checkPages(characters)
    cardsContainer.innerHTML = ``
    characters.data.results.length > 0
    ? showCharacters(characters)
    : showNoResults()
}

const showComics = comics => {
    comics.data.results.map( comic => {
        let offset = comics.data.offset
        totalQuantityOfCollection = comics.data.total
        showNumberOfResults(totalQuantityOfCollection, 'Comics')
        cardsContainer.innerHTML +=
        showComicsCards(comic)
        enableOrDisablePages(offset, totalQuantityOfCollection)
        calculateAllPages()
        chooseCardForDetails('comics')
    })
}

const showCharacters = characters => {
    characters.data.results.map( character => {
        let offset = characters.data.offset
        totalQuantityOfCollection = characters.data.total
        showNumberOfResults(totalQuantityOfCollection, 'Personajes')
        cardsContainer.innerHTML +=
        showCharactersCards(character)
        enableOrDisablePages(offset, totalQuantityOfCollection)
        calculateAllPages()
        chooseCardForDetails('characters')
    })
}

const showNoResults = () => {
    showNumberOfResults(0, 'Personajes')
    showNotFoundMessage()
}

const showNotFoundMessage = () => {
    return cardsContainer.innerHTML = `
        <h2 class="results-container__title">No se han encontrado resultados</h2>`
}

const collectionSearch = document.querySelector('#type-search')
const alphabethicNewestSearch = document.querySelector('#alphabetic-newest-search')
const form = document.querySelector('form')
const inputSearch = document.querySelector('#text-search')

collectionSearch.onchange = () => {
    collectionSearch.value == 'characters'
    ? alphabeticSearch()
    : alphabeticAndDateSearch
}

const alphabeticSearch = () => {
    return      alphabethicNewestSearch.innerHTML= `
    <option value="name">A-Z</option>
    <option value="-name">Z-A</option>
 `
}

const alphabeticAndDateSearch = () => {
    return alphabethicNewestSearch.innerHTML= `
    <option value="title">A-Z</option>
    <option value="-title">Z-A</option>
    <option value="-focDate">Mas Nuevos</option>
    <option value="focDate">Mas Viejos</option>
 `
}

form.onsubmit = (e) => {
    e.preventDefault()
    restartPages()
    hideComicInfoSection()
    hideCharacterInfoSection()
    return inputSearch.value !== ''
    ? showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, inputSearch.value)
    : showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value)
}

const checkIfThereIsAnInputSearch = () => {
    inputSearch.value !== "" || inputSearch.value
}

nextPage.onclick = () => {
    currentPage ++
    if (comicInfoContainer.classList.contains('hidden') && characterInfoContainer.classList.contains('hidden')) {
        showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkIfThereIsAnInputSearch())
    }
    else {
        comicInfoContainer.classList.contains('hidden')
        ? showExtraInfo(urlWithComics, 'characters')
        : showExtraInfo(urlWithCharacters, 'comics')
    }
}

previousPage.onclick = () => {
    currentPage --
    if (comicInfoContainer.classList.contains('hidden') && characterInfoContainer.classList.contains('hidden')) {
        showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkIfThereIsAnInputSearch())
    }
    else {
        comicInfoContainer.classList.contains('hidden')
        ? showExtraInfo(urlWithComics, 'characters')
        : showExtraInfo(urlWithCharacters, 'comics')
    }
}

firstPage.onclick = () => {
    currentPage = 0
    if (comicInfoContainer.classList.contains('hidden') && characterInfoContainer.classList.contains('hidden')) {
        showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, )
    }
    else {
        comicInfoContainer.classList.contains('hidden')
        ? showExtraInfo(urlWithComics, 'characters')
        : showExtraInfo(urlWithCharacters, 'comics')
    }
}

lastPage.onclick = () => {
    const remainder = totalQuantityOfCollection % resultsPerPage
    remainder > 0
    ? currentPage = (totalQuantityOfCollection - (remainder)) / resultsPerPage
    :currentPage = (totalQuantityOfCollection / resultsPerPage) - 1

    if (comicInfoContainer.classList.contains('hidden') && characterInfoContainer.classList.contains('hidden')) {
        showInformationFromApi(collectionSearch.value, alphabethicNewestSearch.value, checkIfThereIsAnInputSearch())
    }
    else {
        comicInfoContainer.classList.contains('hidden')
        ? showExtraInfo(urlWithComics, 'characters')
        : showExtraInfo(urlWithCharacters, 'comics')
    }
}

const restartPages = () => currentPage = 0

const enableOrDisableFirstAndPrevious = () => {
    currentPage == 0
    ? disableFirstAndPrevious()
    : ableFirstAndPrevious()
}

const disableFirstAndPrevious = () => {
    firstPage.disabled = true
    previousPage.disabled = true
    firstPage.classList.add('disable-button')
    previousPage.classList.add('disable-button')
}

const ableFirstAndPrevious = () => {
    firstPage.disabled = false
    previousPage.disabled = false
    firstPage.classList.remove('disable-button')
    previousPage.classList.remove('disable-button')
}

const enableOrDisableLastAndNext = (offset, totalQuantityOfCollection) => {
    offset + resultsPerPage > totalQuantityOfCollection
    ? disableNextAndLast()
    : ableNextAndLast()
}

const disableNextAndLast = () => {
    nextPage.disabled = true
    lastPage.disabled = true
    nextPage.classList.add('disable-button')
    lastPage.classList.add('disable-button')
}

const ableNextAndLast = () => {
    nextPage.disabled = false
    lastPage.disabled = false
    nextPage.classList.remove('disable-button')
    lastPage.classList.remove('disable-button')
}

const enableOrDisablePages = (offset, totalQuantityOfCollection) => {
    enableOrDisableFirstAndPrevious()
    enableOrDisableLastAndNext(offset, totalQuantityOfCollection)
}

const disabledPages = () => {
    disableNextAndLast()
    disableFirstAndPrevious()
}

const ablePages = () => {
    ableNextAndLast()
    ableFirstAndPrevious()
}

const calculateAllPages = () => {
    const remainder = totalQuantityOfCollection % resultsPerPage
    let allPages = ''
    if (remainder > 0){
       allPages =((totalQuantityOfCollection - (remainder)) / resultsPerPage) + 1
    }
    else {
        allPages = totalQuantityOfCollection / resultsPerPage
    }
    pageOfPages.innerHTML = `
        <p>Pagina ${currentPage + 1} de ${allPages}</p>
    `
}