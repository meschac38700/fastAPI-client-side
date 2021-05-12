const old_owner_input = document.querySelector('#old_owner')
const new_owner_input = document.querySelector('#new_owner')
const videos_container = document.querySelector(
    '.form-wrapper__control.select-videos'
)
const suggestions = [
    document.querySelector('.old_owner.suggestions'),
    document.querySelector('.new_owner.suggestions')
]

/**
 * Clear content
 * @param {HTMLElement} suggestion
 * @param {Boolean} alsoContainer
 */
const clearSuggestions = (suggestion, alsoContainer = true) => {
    suggestion.innerHTML = ''
    if (alsoContainer) videos_container.innerHTML = ''
}

/**
 * Create user avatar
 * @param {Object} user
 * @returns HTMLElement
 */
const createAvatarDOM = (user) => {
    const div = document.createElement('DIV')
    div.setAttribute('class', 'video_data')
    img = document.createElement('img')
    img.setAttribute('src', user.avatar)
    img.setAttribute('alt', user.first_name)
    div.appendChild(img)
    return div
}

/**
 * Add event listner keyup, keydown on HTMLInputElement
 * @param {HTMLInputElement} input field to add listener
 * @param {Function} callback event action
 * @param {Number} delay wait time after user stops writing before executing callback
 */
const addSearchListener = (input, callback, delay = 1200) => {
    let timer = null
    let once = false
    input.addEventListener('keyup', (e) => {
        if ((/[a-z0-9\s]/.test(e.key.toLowerCase()) && e.key.length == 1) || e.key.toLowerCase() == 'backspace') {
            once = true
            timer = window.setTimeout(() => {
                if (once) {
                    callback(input)
                }
                once = false
            }, delay)
        }
    })

    input.addEventListener('keydown', () => {
        once = false
        clearTimeout(timer)
        timer = null
    })
}

/**
 *
 * @param {String} search
 * @param {String} attribute
 * @returns {Promise} http response
 */
const getUsers = (search, attribute = 'first_nameORlast_name') => {
    return fetch(
        `http://127.0.0.1:8000/api/v1/users/filter/${attribute}/${search}`
    ).then((data) => {
        return data.json().then((response) => {
            if (response.users.length == 0) {
                response = getUsers(search, 'last_name')
                return response
            }
            return response.users
        })
    })
}
[old_owner_input, new_owner_input].forEach((input) => {
    addSearchListener(input, () => {
        const username = input.value.trim().toLowerCase()
        if (username.length >= 3) {
            getUsers(username).then((users) => {
                usersToSuggest = users.filter(
                    (user) => user.first_name.toLowerCase().includes(username) ||
                        user.last_name.toLowerCase().includes(username)
                )
                // clear previous suggestions before inserting new ones
                clearSuggestions(input.nextElementSibling)
                usersToSuggest.forEach((user) => {
                    p = document.createElement('P')
                    p.setAttribute('id', `user_${user.id}`)
                    p.setAttribute('class', 'user_item')
                    p.innerText = `${user.first_name} ${user.last_name}`
                    input.nextElementSibling.appendChild(p)
                    videos_container.appendChild(createAvatarDOM(user))
                })
            })
        } else clearSuggestions(input.nextElementSibling)
    })
})

suggestions.forEach((suggestion) => {
    suggestion.addEventListener('click', (e) => {
        suggestion.previousElementSibling.value = e.target.textContent
        clearSuggestions(suggestion, false)
    })
})
