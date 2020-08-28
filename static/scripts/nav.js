const userIcon = document.querySelector(".user-icon");
const userDropDownlist = document.querySelector(".dropdown-list");

function showUserDropdownList() {
	event.stopPropagation();
	userDropDownlist.classList.add("showDropDown");
};

function hideUserDropdownList() {
	console.log("hi")
	userDropDownlist.classList.remove("showDropDown");
};

userIcon.addEventListener("click", showUserDropdownList);
window.onclick = () => {
	userDropDownlist.classList.remove("showDropDown");
};


const logoutIcon = document.querySelector(".logout-icon");
const logoutForm = document.querySelector(".logout-form");

logoutIcon.addEventListener("click", () => {
	logoutForm.submit();
});