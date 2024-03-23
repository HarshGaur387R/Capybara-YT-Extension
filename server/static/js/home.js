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

const input = document.querySelector(".capy-input-container input");
const generate_btn = document.getElementById("generate-btn");
const copy_btn = document.querySelector(".copy-btn");

if (generate_btn) {
    generate_btn.onclick = async (e) => {
        generate_btn.disabled = true;
        await generateAccessKey();
    };
}

if (copy_btn) {
    copy_btn.onclick = (e) => {
        input.select();
        document.execCommand("copy");
        alert("Copied to clipboard!");
    };
}

function addColorClassToAnchor() {
    const anchors = document.querySelectorAll(".navbar-list a");
    const currentUrl = window.location.pathname;

    anchors.forEach((anchor) => {
        if (anchor.getAttribute("href") === currentUrl) {
            anchor.classList.add("color-orange");
        }
    });
}

document.addEventListener("DOMContentLoaded", addColorClassToAnchor);

const message_pop = document.querySelector(".message-pop");
const cross_btn = document.querySelector(".cross-btn");

if (cross_btn) {
    cross_btn.addEventListener("click", (e) => {
        if (message_pop) {
            message_pop.classList.add("dis-none");
        }
    });
}

function show_message_pop(bool, msg = "") {
    if (bool) {
        message_pop.classList.remove("dis-none");
        const message = document.querySelector(".message");
        message.textContent = msg;
    } else {
        message_pop.classList.add("dis-none");
    }
}

document.addEventListener("DOMContentLoaded", getAccessKey);

async function getAccessKey() {
    try {
        const parameter = {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        };

        await fetch(`${hostURL}/api/v1/user/getAccessKey`, parameter)
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
                const accesskeyInput = document.querySelector(".capy-input-container input");
                accesskeyInput.value = res.data.accessKey;
            })
            .catch((error) => {
                show_message_pop(true, "Error on reading response from server.");
            });
    } catch (error) {
        show_message_pop(true, "Error on sending request for getAccessKey.");
    }
}

async function generateAccessKey() {
    try {
        const parameter = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        };

        await fetch(`${hostURL}/api/v1/user/generateAccessKey`, parameter)
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
                const accesskeyInput = document.querySelector(".capy-input-container input");
                accesskeyInput.value = res.data.accessKey;
                show_message_pop(true, "New AccessKey generated successfully.");
            })
            .catch((error) => {
                show_message_pop(true, "Error on reading response from server.");
            })
            .finally((e) => {
                generate_btn.disabled = false;
            });
    } catch (error) {
        show_message_pop(
            true,
            "Error on sending request for generateAccessKey."
        );
    }
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