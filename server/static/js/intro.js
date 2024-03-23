const hostURL = conf.HOST_URL

const message_pop = document.querySelector('.message-pop');
const cross_btn = document.querySelector('.cross-btn');

if (cross_btn) {
    cross_btn.addEventListener('click', (e) => {
        if (message_pop) { message_pop.classList.add('dis-none') }
    });
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

const news_latter_form_btn = document.querySelector('.news-latter-form-btn');
if (news_latter_form_btn) {

    news_latter_form_btn.addEventListener('mouseenter', (e) => {
        const root = document.querySelector(':root');
        root.style.setProperty('--var1', '0px');
    })

    news_latter_form_btn.addEventListener('mouseleave', (e) => {
        const root = document.querySelector(':root');
        root.style.setProperty('--var1', '-220px');
    })

    if (window.PointerEvent) {

        news_latter_form_btn.addEventListener('pointerdown', (e) => {

            news_latter_form_btn.style.color = 'orange'
        })

        news_latter_form_btn.addEventListener('pointerup', (e) => {
            news_latter_form_btn.style.color = 'black'
        })
    }

}

const signup_btn = document.getElementById('signup-btn');
if (signup_btn) {
    signup_btn.addEventListener('click', (e) => {
        window.location.href = "/signup";
    });
}

const download_btn = document.getElementById('download-btn');
if (download_btn) {
    download_btn.addEventListener('click', (e) => {
        const a_tag = document.createElement('a');
        a_tag.href = '/extension.zip';
        a_tag.download = 'capybara-extension';
        a_tag.click();
    })
}

const about_btn = document.getElementById('about-btn');
if (about_btn) {
    about_btn.addEventListener('click', (e) => {
        window.location.href = '/about';
    })
}

const news_latter_form = document.querySelector('.news-latter-form');

if (news_latter_form) {
    news_latter_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('.news-latter-form-input').value;
        await subscribeToNewsLatter(email);
    })
}

async function subscribeToNewsLatter(email) {
    if (!email) {
        show_message_pop(true, 'Email is not provided. Please enter your Email');
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
            })
        }

        await fetch(`${hostURL}/api/v1/auth/subscribeToNewsLatter`, parameter)
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

                const message_head = document.querySelector('.head');
                if (message_head) {
                    message_head.textContent = 'Subscribed!';
                }
                show_message_pop(true, 'Thank you for subscribing our news latter');

            }).catch((error) => {
                show_message_pop(true, 'Error on reading response from server.');
                console.log('News Latter:', error);
            })

    } catch (error) {
        show_message_pop(true, 'Error on sending request for News Latter.');
        console.log('NewsLatter:', error);
    }
}