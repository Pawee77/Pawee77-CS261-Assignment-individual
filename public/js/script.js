const { response } = require("express");
function submitLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usernameRegex = /^\d{10}$/;
    const passwordRegex = /^\d{13}$/;  

    let errorMessage = '';

    if (!usernameRegex.test(username)) {
        errorMessage += 'Username ต้องมีตัวเลข 10 หลัก\n';
    }

    if (!passwordRegex.test(password)) {
        errorMessage += 'Password ต้องมีตัวเลข 13 หลัก (ตามรหัสบัตรประชาชน)\n';
    }

    if (errorMessage) {
        document.getElementById('popupMessage').innerText = errorMessage;
        document.getElementById('popupMessage').style.color = "red";
        document.getElementById('userInfo').innerHTML = '';  
        showPopup();  
        return;  
    }

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': ''
        },
        body: JSON.stringify({ UserName: username, PassWord: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let message = '';
        let details = '';

        if (data.status) {
            message = `Welcome, ${data.displayname_en || data.displayname_th}!`;

            details = `
                <li>Status: ${data.tu_status}</li>
                <li>Username: ${data.username}</li>
                <li>Email: ${data.email}</li>
                <li>Faculty: ${data.faculty}</li>
                <li>Department: ${data.department}</li>
                <li>Type: ${data.type}</li>
            `;

            document.getElementById('popupMessage').style.color = "green";
        } else {
            message = data.message;
            document.getElementById('popupMessage').style.color = "red";
        }

        document.getElementById('popupMessage').innerText = message;
        document.getElementById('userInfo').innerHTML = details;

        showPopup();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('popupMessage').innerText = 'Login failed. Please try again.';
        document.getElementById('popupMessage').style.color = "red";

        showPopup();
    });
}

function showPopup() {
    document.getElementById('loginPopup').classList.add('show');
}

function closePopup() {
    document.getElementById('loginPopup').classList.remove('show');
}

