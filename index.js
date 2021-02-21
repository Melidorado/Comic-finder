const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = 'fe90364a19b7f147e6c8d3fead703e80';
const cardsContainer = document.querySelector('.cards-container')
const comicInfoContainer = document.querySelector('.comic-information__container')

const resultsContainer = document.querySelector('.results-container')

const firstPage = document.querySelector("#first-page")
const previousPage = document.querySelector("#previous-page")
const nextPage = document.querySelector("#next-page")
const lastPage = document.querySelector("#last-page")
const loader = document.querySelector("#loader-container")

const checkIfThereIsImageInCharacter = comic => {
    return comic.thumbnail.path.endsWith(`image_not_available`)
    ? `./no-pic.jpg`
    : `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`
}

const showCharactersCards = (character) => {
    return `<article class="character-card" >
         <div class="character-card__image-container">
            <img class="character-card__image" src="${checkIfThereIsImageInCharacter(character)}"/>
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

const showInformationFromApi = (inputSearch = " ", collection = "comics", orderBy = "title") => {
    let inputParam = ''
    
    if (inputSearch !== " " ) {
        console.log(inputSearch !== ' ')
        inputParam = `&titleStartsWith=${inputSearch}`
    }

    fetch(`${baseUrl}${collection}?apikey=${apiKey}&orderBy=${orderBy}${inputParam}`)
    .then(res => res.json())
    .then(information => {
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
        comicInfoContainer.innerHTML = ``

        const comicCards = document.querySelectorAll('.comic-card')

        comicCards.forEach(card => {
            card.onclick = (e) => {
                comicId = e.target.dataset.id
                cardsContainer.innerHTML = ``
                resultsContainer.innerHTML = ``
                showComicCardInformation(`${baseUrl}${info}/${comicId}?apikey=${apiKey}`)
            }
        })
    })    
}

showInformationFromApi()

const showComicCardInformation = (url) => {
fetch(url)
.then(res => res.json())
.then(comic => {
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
                        <p class="writers">${showComicWriters(comic)}</p>
                        <h3>Descripción:</h3>
                        <p>${comic.description}</p>
                    </div>`

                    
    })

})
}

const showComicWriters = comic => {
    return comic.creators.items.map( creator => {
        return creator.role == "writer"
        ? ` ${creator.name}`
        : ` `  
    })
}
    



const collectionSearch = document.querySelector('#type-search')
const alphabethicNewestSearch = document.querySelector('#alphabetic-newest-search')
const form = document.querySelector('form')
const inputSearch = document.querySelector('#text-search')

form.onsubmit = (e) => {
    e.preventDefault()
    return inputSearch.value !== ''
    ? showInformationFromApi(inputSearch.value, collectionSearch.value, alphabethicNewestSearch.value)
    : showInformationFromApi(" ", collectionSearch.value, alphabethicNewestSearch.value)
}
