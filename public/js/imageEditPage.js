const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')]
const deleteButton = document.querySelector('#deleteImagesButton')
const images = [...document.querySelectorAll('img')]

const disableDeleteButton = () => {
    if (checkboxes.find((checkbox) => checkbox.checked === true)) {
        deleteButton.removeAttribute('disabled')
    } else {
        deleteButton.setAttribute('disabled', true)
    }
}

for (let checkbox of checkboxes) {
    checkbox.addEventListener('click', disableDeleteButton)
}

images.forEach(function (img, i) {
    img.addEventListener('click', () => {
        const checkbox = document.querySelector(`#image-${i}`)
        checkbox.checked = !checkbox.checked
        disableDeleteButton()
    })
})