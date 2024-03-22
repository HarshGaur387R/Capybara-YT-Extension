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
        if (message_pop) { message_pop.classList.add('dis-none') }
    });
}

const signup_form = document.querySelector('.signup-form');

if (signup_form) {
    signup_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name-input').value;
        const email = document.getElementById('signup-email-input').value;
        const password = document.getElementById('signup-password-input').value;

        await signup(name, email, password);
    })
}

async function signup(name, email, password) {

    if (!name) {
        show_message_pop(true, 'Name is required.')
        return;
    }

    if (!email) {
        show_message_pop(true, 'Email not provided. Please enter your email address');
        return;
    }
    else if (!password) {
        show_message_pop(true, 'Password is not provided. Please enter your password');
        return;
    }

    try {
        show_loading_window(true);

        const parameter = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password
            })
        }

        await fetch(`${hostURL}/api/v1/auth/signup`, parameter)
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

                window.location.href = '/verifyEmail';

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('signup:', error);
            }).finally(() => {
                show_loading_window(false);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for signup.');
        console.log('signup:', error);
    }
}