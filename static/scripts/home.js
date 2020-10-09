const apiKey = "05398268caf59c59aef969e3b30d6886";
const appId = "8b1436a3";

const openAddContainerButton = document.querySelector(".open-add-container");
const searchBtn = document.querySelector(".search-product");
const productInput = document.querySelector(".productInput");
const addFoodContainer = document.querySelector(".add-food");
const addCloseIcon = addFoodContainer.querySelector(".close");

function openAddContainer() {
	addFoodContainer.classList.add("showAdd");
}

openAddContainerButton.addEventListener("click", openAddContainer);

function searchProduct() {
	let dish = productInput.value;
	let dishUrlEncoded = dish.replace(/ /g, "%20");
	console.log(dishUrlEncoded);
	searchBtn.innerHTML = `<div class="loader"></div>`;
	fetch(`https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${apiKey}&ingr=${dishUrlEncoded}`)
	.then((response) => {
		if (!response.ok) {
			console.log(`response is not ok: ${response.status}`);
			searchBtn.innerText = "Niet gevonden...";
		} else {
			searchBtn.innerText = "Gevonden!";
		}
		return response.json()
	})
	.then((data) => {
		let productData = {
			"calories": data.totalNutrientsKCal.ENERC_KCAL.quantity,
			"fats": data.totalNutrientsKCal.FAT_KCAL.quantity,
			"proteins": data.totalNutrientsKCal.PROCNT_KCAL.quantity
		};
		console.log(data);
		console.log(data.totalNutrientsKCal)
		console.log(productData);
		showProductNutrients(productData);
	})
}

function showProductNutrients(productObject) {
	let productHtml = `
		<ul>
			<li>Calorieën: ${productObject.calories}</li>
			<li>Vetten: ${productObject.fats}</li>
			<li>Proteïne: ${productObject.proteins}</li>
		</ul>
	`;

	searchBtn.insertAdjacentHTML("beforebegin", productHtml);
}

searchBtn.addEventListener("click", searchProduct);

function closeAddContainer() {
	addFoodContainer.classList.remove("showAdd");
}

addCloseIcon.addEventListener("click", closeAddContainer);