const requirementsSaveBtn = document.querySelector(".requirementsSave");
const loader = `<div class="boxLoading"></div>`;

function updateData(event) {
	requirementsSaveBtn.innerHTML = loader;

	let xhr = new window.XMLHttpRequest();

	xhr.onload = function () {
		if (xhr.status === 200) {
			let responseObject = JSON.parse(xhr.response);
			requirementsSaveBtn.innerText = "Opslaan";
			if (responseObject.succeeded) {
				requirementsSaveBtn.innerHTML += `<svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 7.5L7 10L11 5" stroke="white"/>
</svg>
`;
			} else {
				document.querySelector(".save-error-message").classList.add("showError");
			}
		}
	}

	const data = {
		calories: document.querySelector(`input[name="calories"]`).value,
		protein: document.querySelector(`input[name="protein"]`).value,
		fats: document.querySelector(`input[name="fats"]`).value,
		carbohydrates: document.querySelector(`input[name="carbohydrates"]`).value
	}

	xhr.open("POST", "/updateRequirements", true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.send(JSON.stringify(data));

	event.preventDefault();
}

requirementsSaveBtn.addEventListener("click", updateData)