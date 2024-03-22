const hostURL = 'http://localhost:5000'

const message_pop = document.querySelector('.message-pop');
const cross_btn = document.querySelector('.cross-btn');

function show_loading_window(bool) {
    const loading_window = document.querySelector('.loading-window');

    if (bool) {
        loading_window.classList.remove('dis-none');
    }
    else {
        loading_window.classList.add('dis-none');
    }
}

function show_message_pop(bool, msg = '') {
    if (bool) {
        message_pop.classList.remove('dis-none');
        const message = document.querySelector('.message');
        message.textContent = msg;
    }
    else {
        message_pop.classList.add('dis-none');
    }
}

if (cross_btn) {
    cross_btn.addEventListener('click', (e) => {
        if (message_pop) { show_message_pop(false); }
    });
}

const login_form = document.querySelector('.login-form');

if (login_form) {
    login_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email-input').value;
        const password = document.getElementById('login-password-input').value;

        await login(email, password);
    })
}

async function login(email, password) {
    if (!email) {
        show_message_pop(true, 'Email not provided. Please enter your email address');
        return;
    }
    else if (!password) {
        show_message_pop(true, 'Password is not provided. Please enter your password');
        return;
    }

    try {
        const parameter = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }

        await fetch(`${hostURL}/api/v1/auth/login`, parameter)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error.constructor === Array) {
                        show_message_pop(true, res.error[0].msg);
                        return;
                    }
                    else {
                        show_message_pop(true, res.error.msg);
                        return;
                    }
                }

                window.location.href = '/home';

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('login:', error);
            }).finally(() => {
                show_loading_window(false);
            })
            ;

    } catch (error) {
        show_message_pop(true, 'Error on sending request for login.');
        console.log('login:', error);
    }
}