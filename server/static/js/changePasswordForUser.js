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
        const password = document.getElementById('fp-password-input').value;
        const confirm_password = document.getElementById('fp-confirm-password-input').value;
        await update_password(password, confirm_password);
    })
}

async function update_password(new_password, confirm_password) {
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
                "password": new_password,
            })
        }

        await fetch(`${hostURL}/api/v1/user/updatePassword`, parameter)
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

                const fp_container = document.querySelector('.fp-container');
                const login_container = document.querySelector('.login-container');

                if (fp_container && login_container) {
                    fp_container.classList.add('dis-none');
                    login_container.classList.remove('dis-none');
                }

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('changePassword:', error);
            }).finally(() => {
                show_loading_window(false);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for changeEmail.');
        console.log('changePassword:', error);
    }
}


const verifyBtn = document.querySelector('.verifyBtn');
if (verifyBtn) {
    verifyBtn.addEventListener('mousedown', (e) => {
        const root = document.querySelector(':root');
        root.style.setProperty('--scale', '0.9');
    })

    verifyBtn.addEventListener('mouseup', (e) => {
        const root = document.querySelector(':root');
        root.style.setProperty('--scale', '1');
    })
}

const inputBoxes = document.querySelectorAll('.inputBoxes');
if (inputBoxes) {
    inputBoxes.forEach(function (inputBox, index) {
        inputBox.addEventListener('paste', function (e) {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            console.log(pastedText);
            distributeCode(pastedText);
        });

        inputBox.addEventListener('input', function (e) {
            handleInput(e.target, index);
        });
    });

    function distributeCode(code) {
        // Distribute the code among the input boxes
        for (let i = 0; i < inputBoxes.length; i++) {
            inputBoxes[i].value = code[i] || '';
        }

        // Move cursor to the next input box
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputBoxes.length) {
            inputBoxes[nextIndex].focus();
        }
    }

    function handleInput(inputBox, currentIndex) {
        // Move cursor to the next input box after typing
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputBoxes.length && inputBox.value) {
            inputBoxes[nextIndex].focus();
        }
    }
}

const email_verifying_form = document.getElementById('email-verifying-form');

if (email_verifying_form) {
    email_verifying_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let code = '';
        document.querySelectorAll('.inputBoxes').forEach((ele) => {
            code += ele.value;
        });
        await sendEmailVerification(code);
    })
}

async function sendEmailVerification(verificationCode) {
    if (!verificationCode) {
        show_message_pop(true, 'Code is not provided. Please enter valid verification code');
        return;
    }

    try {
        const parameter = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "verificationCode": verificationCode
            })
        }

        await fetch(`${hostURL}/api/v1/user/verifyEmailToUpdatePassword`, parameter)
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
                window.location.href = '/profile';

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('verifyEmail to update password:', error);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for verifyEmail.');
        console.log('verifyEmail to update password: ', error);
    }
}

const goBackBtn = document.getElementById('goBackBtn');
if (goBackBtn) {
    goBackBtn.addEventListener('click', (e) => {
        window.location.href = "/profile"
    });
}