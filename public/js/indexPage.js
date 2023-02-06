const campgroundsCards = [...document.querySelectorAll('.campgroundCard')]
const loadButton = document.querySelector('.loadButton')

if(campgroundsCards.length < 11) loadButton.setAttribute('disabled', true)


for (let i = 10; i < campgroundsCards.length; i++) {
    campgroundsCards[i].setAttribute('hidden', true)
}

loadButton.addEventListener('click', (e) => {
    const hiddenCampgrounds = document.querySelectorAll('.campgroundCard[hidden]')
    console.log(hiddenCampgrounds)
    if (!hiddenCampgrounds.length) {
        loadButton.setAttribute('disabled', true)
    } else {
        for (let i = 0; i < (hiddenCampgrounds.length > 10 ? 10: hiddenCampgrounds.length); i++) {
            hiddenCampgrounds[i].removeAttribute('hidden')
        }
    }
    console.log(hiddenCampgrounds)
})