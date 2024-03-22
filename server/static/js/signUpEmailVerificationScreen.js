const hostURL = 'http://localhost:5000'
const message_pop = document.querySelector('.message-pop');
const cross_btn = document.querySelector('.cross-btn');

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

const goBackBtn = document.getElementById('goBackBtn');
if (goBackBtn) {
    goBackBtn.addEventListener('click', (e) => {
        window.location.href = "/home"
    });
}


const form = document.getElementById('email-verifying-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let code = '';
        document.querySelectorAll('.inputBoxes').forEach((ele) => {
            code += ele.value;
        });

        console.log(code);
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

        await fetch(`${hostURL}/api/v1/auth/verifyEmail`, parameter)
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
                console.log('verifyEmail:', error);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for verifyEmail.');
        console.log('verifyEmail:', error);
    }
}

function enableResendCodeAfter30Seconds() {
    setTimeout(() => {
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        if (resendCodeBtn) {
            resendCodeBtn.removeAttribute('disabled');
        }
    }, 3000)
}

const resendCodeBtn = document.getElementById('resendCodeBtn');
if (resendCodeBtn) {
    resendCodeBtn.onclick = async (e) => {
        resendCodeBtn.setAttribute('disabled', true);
        enableResendCodeAfter30Seconds();
        await resendCode();
    }
}

async function resendCode() {
    try {
        const parameter = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }

        await fetch(`${hostURL}/api/v1/auth/resendCode`, parameter)
            .then((res) => res.json())
            .then((res) => {
                if (res.error && res.error.msg) {
                    show_message_pop(true, res.error.msg);
                    return;
                }

                const message_head = document.querySelector('.head');
                if (message_head) {
                    message_head.textContent = 'Mail Sent';
                }
                show_message_pop(true, 'Code sended at your email successfully');

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('resendCode:', error);
            });

    } catch (error) {
        show_message_pop(true, 'Error on sending request for resendCode.');
        console.log('resendCode:', error);
    }
}

enableResendCodeAfter30Seconds();