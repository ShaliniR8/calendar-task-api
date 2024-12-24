function setAction(action) {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const actionInput = document.getElementById('action');

    actionInput.value = action;
    if (action === 'login') {
        loginButton.classList.add('btn-success');
        loginButton.classList.remove('btn-light');
        registerButton.classList.add('btn-light');
        registerButton.classList.remove('btn-success');
    } else {
        registerButton.classList.add('btn-success');
        registerButton.classList.remove('btn-light');
        loginButton.classList.add('btn-light');
        loginButton.classList.remove('btn-success');
    }
}