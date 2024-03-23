const hostURL = conf.HOST_URL
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

const fp_form = document.querySelector('.fp-form');

if (fp_form) {
    fp_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('fp-email-input').value;
        const new_password = document.getElementById('fp-password-input').value;
        const confirm_password = document.getElementById('fp-confirm-password-input').value;

        await forget_password(email, new_password, confirm_password);
    })
}

async function forget_password(email, new_password, confirm_password) {
    if (!email) {
        show_message_pop(true, 'Name is required.')
        return;
    }

    if (!new_password) {
        show_message_pop(true, 'Email not provided. Please enter your email address');
        return;
    }
    else if (!confirm_password) {
        show_message_pop(true, 'Password is not provided. Please enter your password');
        return;
    }

    else if (confirm_password !== new_password) {
        show_message_pop(true, 'Please Enter correct Confirm password.');
        return;
    }

    try {
        show_loading_window(true);

        const parameter = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": new_password,
            })
        }

        await fetch(`${hostURL}/api/v1/auth/forgetPassword`, parameter)
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

                window.location.href = '/verifyEmailToForgetPassword';

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('forgetPassword:', error);
            }).finally(() => {
                show_loading_window(false);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for forgetPassword.');
        console.log('forgetPassword:', error);
    }

}