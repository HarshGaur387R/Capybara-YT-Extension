const hostURL = conf.HOST_URL

const menu_btn_respo = document.querySelector('.menu-btn-respo');
const responsive_nav_bar = document.querySelector('.responsive-nav-bar');
const responsive_nav_bar_container = document.querySelector('.responsive-nav-bar-container');

if (menu_btn_respo) {
    menu_btn_respo.onclick = (e) => {
        if (responsive_nav_bar.style.display === 'none') {
            responsive_nav_bar.style.display = 'flex';
            responsive_nav_bar.style.top = '45px'
            responsive_nav_bar_container.style.display = 'block';
        }
        else {
            responsive_nav_bar.style.display = 'none';
            responsive_nav_bar.style.top = '-9000px'
            responsive_nav_bar_container.style.display = 'none';
        }
    }
}

const input = document.querySelector('.capy-input-container input');
const save_btn = document.getElementById('save-btn');
const copy_btn = document.querySelector('.copy-btn');


if (copy_btn) {
    copy_btn.onclick = (e) => {
        input.select();
        document.execCommand("copy");
        alert("Copied to clipboard!");
    }
}


function addColorClassToAnchor() {
    const anchors = document.querySelectorAll('.navbar-list a');
    const currentUrl = window.location.pathname;

    anchors.forEach(anchor => {
        if (anchor.getAttribute('href') === currentUrl) {
            anchor.classList.add('color-orange');
        }
    });
}

document.addEventListener('DOMContentLoaded', addColorClassToAnchor);
document.addEventListener('DOMContentLoaded', get_my_data);

async function get_my_data() {
    const name_input = document.getElementById('name-input');
    const email_input = document.getElementById('email-input');
    const password_input = document.getElementById('password-input');

    try {
        await fetch(`${hostURL}/api/v1/user/my-data`)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error.constructor === Array) {
                        show_message_pop(true, res.error[0].msg);
                        return;
                    } else {
                        show_message_pop(true, res.error.msg);
                        return;
                    }
                }
                name_input.value = res.data.name;
                email_input.value = res.data.email;
                password_input.value = res.data.password;
            })
            .catch((error) => {
                show_message_pop(true, "Error on reading response from server.");
            })
    } catch (error) {
        show_message_pop(
            true,
            "Error on sending request to get user detail."
        );
    }
}

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


async function change_name() {
    const name = document.getElementById('name-input').value;
    try {
        const parameter = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name
            })
        };

        await fetch(`${hostURL}/api/v1/user/updateUserName`, parameter)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error.constructor === Array) {
                        show_message_pop(true, res.error[0].msg);
                        return;
                    } else {
                        show_message_pop(true, res.error.msg);
                        return;
                    }
                }
                const message_head = document.querySelector(".head");
                if (message_head) {
                    message_head.textContent = "Successful!";
                }
                show_message_pop(true, "Name Updated Successfully!");
                document.getElementById('name-input').value = name;
            })
            .catch((error) => {
                show_message_pop(true, "Error on reading response from server.");
            })
            .finally((e) => {
                save_btn.disabled = false;
            });
    } catch (error) {
        show_message_pop(
            true,
            "Error on sending request to update name."
        );
    }
}

save_btn.onclick = async (e) => {
    await change_name();
}

// Logout-btn

const logout_btn = document.querySelectorAll('.logout-btn button');

if (logout_btn.length > 0) {
    logout_btn.forEach(e => {
        e.onclick = async (e) => {
            console.log('logout button clicked! in logout button cb');
            await logout();
        }
    });
}

async function logout() {
    try {
        const parameter = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }

        await fetch(`${hostURL}/api/v1/user/signout`, parameter)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error.constructor === Array) {
                        show_message_pop(true, res.error[0].msg);
                        return;
                    } else {
                        show_message_pop(true, res.error.msg);
                        return;
                    }
                }

                location.href = '/'
            })
            .catch((error) => {
                show_message_pop(true, "Error on reading response from server.");
            })
    } catch (error) {
        show_message_pop(
            true,
            "Error on sending request to logout."
        );
    }
}