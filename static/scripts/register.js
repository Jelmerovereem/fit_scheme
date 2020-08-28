const registerBtn = document.querySelector(".register.btn");

function postCreateUserForm(event) {
	let xhr = new window.XMLHttpRequest();

	xhr.onload = function () {
		if (xhr.status === 200) {
			let responseObject = JSON.parse(xhr.response);
			if (responseObject.exists) {
				document.querySelector(".email-exists-message").style.display = "block";
				//alert("Email bestaat al");
			} else {
				window.location.href = "/";
			}
			
		}
	}

	const data = {
		email: document.querySelector(`input[name="emailAddress"]`).value,
		name: document.querySelector(`input[name="fullName"]`).value,
		length: document.querySelector(`input[name="length"]`).value,
		age: document.querySelector(`input[name="age"]`).value,
		weight: document.querySelector(`input[name="weight"]`).value,
		password: document.querySelector(`input[name="password"]`).value
	};

	console.log(data);

	xhr.open("POST", "/postRegister", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(data));

	event.preventDefault();
}

registerBtn.addEventListener("click", postCreateUserForm);