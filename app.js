const old_owner_input = document.querySelector("#old_owner");
const new_owner_input = document.querySelector("#new_owner");
const videos_container = document.querySelector(
	".form-wrapper__control.select-videos"
);
const suggestions = [
	document.querySelector(".old_owner.suggestions"),
	document.querySelector(".new_owner.suggestions"),
];

const clearSuggestions = (suggestion, alsoContainer = true) => {
	suggestion.innerHTML = "";
	if (alsoContainer) videos_container.innerHTML = "";
};

const createAvatarDOM = (user) => {
	const div = document.createElement("DIV");
	div.setAttribute("class", "video_data");
	img = document.createElement("img");
	img.setAttribute("src", user.avatar);
	img.setAttribute("alt", user.first_name);
	div.appendChild(img);
	return div;
};

const getUsers = () => {
	return fetch("http://127.0.0.1:8000/api/v1/users/?limit=100&offset=0").then(
		(data) => {
			return data.json().then((response) => {
				return response.users;
			});
		}
	);
};
[old_owner_input, new_owner_input].forEach((input) => {
	input.addEventListener("input", () => {
		const username = input.value.trim().toLowerCase();
		if (username.length >= 3) {
			getUsers().then((users) => {
				usersToSuggest = users.filter(
					(user) =>
						user.first_name.toLowerCase().includes(username) ||
						user.last_name.toLowerCase().includes(username)
				);
				// clear previous suggestions before inserting new ones
				clearSuggestions(input.nextElementSibling);
				usersToSuggest.forEach((user) => {
					p = document.createElement("P");
					p.setAttribute("id", `user_${user.id}`);
					p.setAttribute("class", "user_item");
					p.innerText = `${user.first_name} ${user.last_name}`;
					input.nextElementSibling.appendChild(p);
					videos_container.appendChild(createAvatarDOM(user));
				});
			});
		} else clearSuggestions(input.nextElementSibling);
	});
});

suggestions.forEach((suggestion) => {
	suggestion.addEventListener("click", (e) => {
		suggestion.previousElementSibling.value = e.target.textContent;
		clearSuggestions(suggestion, false);
	});
});
