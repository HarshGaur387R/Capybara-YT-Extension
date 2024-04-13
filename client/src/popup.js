const url = 'https://capybara-yt-extension.vercel.app/'
const formContainer = document.getElementById('formContainer');
const authorizedContainer = document.getElementById('authorizedContainer');

// ele1 element to show and ele2 element to hide
function showAndHide(ele1, ele2) {
    ele1.classList.remove("d-none");
    ele2.classList.add("d-none");
}


chrome.storage.sync.get('accessKey', async function (result) {
    if (result.accessKey) {
        await verifyAccessKey(result.accessKey, () => { showAndHide(authorizedContainer, formContainer) });
    } else {
        showAndHide(formContainer, authorizedContainer)
    }
});


const accessKeyInput = document.getElementById('accessKeyInput');
const accessKeySubmitBtn = document.getElementById('accessKeySubmitBtn');


if (accessKeySubmitBtn) {
    accessKeySubmitBtn.onclick = (e) => {
        e.preventDefault();
        if (accessKeyInput) {
            const value = accessKeyInput.value;
            chrome.storage.sync.set({ accessKey: value }, async () => {
                await verifyAccessKey(value, () => { showAndHide(authorizedContainer, formContainer) });
            });
        }
    }
}

const accessKeyRemoveBtn = document.getElementById('accessKeyRemoveBtn');

if (accessKeyRemoveBtn) {
    accessKeyRemoveBtn.onclick = (e) => {
        chrome.storage.sync.get('accessKey', function (result) {
            if (result.accessKey) {
                chrome.storage.sync.remove('accessKey', function () {
                    var error = chrome.runtime.lastError;
                    if (error) { console.error(error) }
                    showAndHide(formContainer, authorizedContainer)
                })
            }
        });
    }
}


async function verifyAccessKey(accessKey, callback) {
    const parameter = {
        method: 'POST',
        body: JSON.stringify({ accessKey }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    await fetch(`${url}api/v1/auth/verifyAccessKey`, parameter).then(res => res.json())
        .then(response => {
            if (response.error) { console.log(response.error); return }
            if (response.success) { console.log('Success: ', response.success); callback(); return }
        })
        .catch(error => console.log('Error', error));
}