const loginBtn = document.querySelector(".login.btn");

function postLoginForm(event) {
	let xhr = new window.XMLHttpRequest();

	xhr.onload = function () {
		if (xhr.status === 200) {
			console.log(xhr.response);
			let responseObject = JSON.parse(xhr.response);
			console.log(responseObject);
			if (responseObject.userFound === false) {
				/*alert("user not found");*/
				document.querySelector("#email-label").style.color = "red";
				document.querySelector(".user-not-found").classList.add("show-error");
			} else if (responseObject.password === false) {
				document.querySelector("#email-label").style.color = "#4285f4";
				document.querySelector(".user-not-found").classList.remove("show-error");
				document.querySelector(".password-wrong").classList.add("show-error");
				/*alert("password wrong");*/
			} else if (responseObject.password === true) {
				window.location.href = "/";
			}
		}
	}

	const data = {
		email: document.querySelector(`input[name="emailAddress"]`).value,
		password: document.querySelector(`input[name="password"`).value
	};

	xhr.open("POST", "/postLogin", true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.send(JSON.stringify(data));

	event.preventDefault();
}

loginBtn.addEventListener("click", postLoginForm);