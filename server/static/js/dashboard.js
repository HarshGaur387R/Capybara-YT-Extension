const hostURL = 'http://localhost:5000'

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
const generate_btn = document.getElementById('generate-btn');
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
document.addEventListener('DOMContentLoaded', getRequestData)
document.addEventListener('DOMContentLoaded', getRequestsRecordData);
document.addEventListener('DOMContentLoaded', getAccessTokenUsers);

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


async function getRequestData() {
    try {
        await fetch(`${hostURL}/api/v1/user/getTotalRequestsRecord`)
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

                const { totalRequests, succeedRequests, failedRequests } = res.data;
                show_data_on_board(totalRequests, succeedRequests, failedRequests);

            })
    } catch (error) {
        show_message_pop(
            true,
            "Error on fetching request records."
        );
        console.log(error);
    }
}


function show_data_on_board(totalRequests, succeedRequests, failedRequests) {
    const total_requests_sent = document.getElementById('total_requests_sent');
    const total_requests_failed = document.getElementById('total_requests_failed');
    const total_requests_succeed = document.getElementById('total_requests_succeed');

    if (total_requests_failed && total_requests_sent && total_requests_succeed) {
        total_requests_sent.textContent = totalRequests;
        total_requests_failed.textContent = failedRequests;
        total_requests_succeed.textContent = succeedRequests;

        // Calculate the percentage and display it.
        var percentage = Math.floor((succeedRequests / totalRequests) * 100);
        document.querySelector('.meter').setAttribute('meter-level', `${percentage}%`);
        document.documentElement.style.setProperty('--meter-level-percentage', percentage + '%');

        if (percentage >= 10) {
            document.documentElement.style.setProperty('--meter-shine-level', '11%');
        }
    }
}

// Zoom in and out button
const zoomin = document.getElementById('zoomin-btn');
const zoomout = document.getElementById('zoomout-btn');

if (zoomin && zoomout) {
    zoomin.onclick = (e) => {
        set_Single_Bar_Width('increase', 10);
    }

    zoomout.onclick = (e) => {
        set_Single_Bar_Width('decrease', 10);
    }
}

function set_Single_Bar_Width(operation = 'increase', by) {
    let style = getComputedStyle(document.documentElement);
    let size = style.getPropertyValue('--single-bar-size').trim();
    let number = Number(size.match(/\d+\.?\d*/g));

    if (number < 100 && operation === 'increase') {
        document.documentElement.style.setProperty('--single-bar-size', `${number += by}px`);
        return;
    }
    else if (number > 10 && operation === 'decrease') {
        document.documentElement.style.setProperty('--single-bar-size', `${number -= by}px`);
        return;
    }
}


function populateBars(data) {
    const data_bars = document.querySelector('.data-bars');

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const value = data[key];
            const single_bar = document.createElement('div');
            single_bar.classList.add('single-bar');
            single_bar.style.height = `${10 * value.request}px`;
            single_bar.setAttribute('data-toggle', 'tooltip');
            single_bar.title = `req:${value.request}, ${key}`

            data_bars.append(single_bar);
        }
    }
}


async function getRequestsRecordData() {
    try {
        await fetch(`${hostURL}/api/v1/user/getRequestsRecordData`)
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
                populateBars(res.data);
            })
    } catch (error) {
        show_message_pop(
            true,
            "Error on fetching request records data."
        );
        console.log(error);
    }
}


async function getAccessTokenUsers() {
    try {
        await fetch(`${hostURL}/api/v1/user/getAccessTokenUsers`)
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
                populateDevicesContainer(res.data);
            })
    } catch (error) {
        show_message_pop(
            true,
            "Error on fetching access token users."
        );
        console.log(error);
    }
}


function populateDevicesContainer(devices) {
    const devicesContainer = document.querySelector('.devicesContainer');

    devices.forEach((device) => {
        const device_name = document.createElement('div');
        device_name.classList.add('device-detail-box');

        const html = `
                    <div class="device-name">
                        <span>Device Name :</span>
                    <div class="user-device">${device.deviceType}</div>
                    </div>
                    <div class="os_name">
                        <span>OS Name :</span>
                    <div class="user-os-name">${device.OS_Name}</div>
                    </div>
                `
        device_name.innerHTML = html;
        devicesContainer.append(device_name);
    })
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
        console.log(error);
    }
}