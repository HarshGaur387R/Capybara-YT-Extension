// content.js

const html = `

<div class="radio-options">

    <div class="anotherContainer">
        <div class="mainOption">
            <label class="optionLabel" for="videoOption">Video & Audio</label>
            <input checked type="radio" name="media" id="videoOption" value="video">
        </div>

        <div class="btnsHolder flex-direction">
            <div class="formats">
                <div class="BtnContainer">
                    <label class="input-label" for="mp4">Mp4</label>
                    <input type="radio" checked name="videoFormat" id="mp4" value="mp4">
                </div>
                
                <div class="BtnContainer">
                    <label class="input-label" for="webm">Webm</label>
                    <input type="radio" name="videoFormat" id="webm" value="webp">
                </div>
            </div>

            <div class="quality">
                <div class="BtnContainer">
                    <label class="input-label" for="highest">Highest</label>
                    <input type="radio" name="quality" id="highest" value="highest">
                </div>
                
                <div class="BtnContainer">
                    <label class="input-label" for="lowest">Lowest</label>
                    <input type="radio" checked name="quality" id="lowest" value="lowest">
                </div>
            </div>
        </div>
    </div>

    <div class="anotherContainer">
        <div class="mainOption">
            <label class="optionLabel" for="audioOption" class="optionLabel">Audio</label>
            <input type="radio" name="media" id="audioOption" value="audio">
        </div>

        <div class="btnsHolder">
            <div class="BtnContainer">
                <label class="input-label" for="mp3">Mp3</label>
                <input type="radio" name="audioFormat" value="mp3" checked id="mp3">
            </div>
        </div>
    </div>
</div>

<div class="download-window-loading dis-none">
    <div class="loading-window-img-container">
        <span class="loader"></span>
    </div>
    <div class="loading-window-heading">
        <h1>Purr Purr Loading...</h1>
    </div>
</div>

<div class="operationsBtnContainer">
    <input type="button" id="downloadMediaBtn" class="operationBtn" value="Download">
    <input type="button" id="cancelBtn" class="operationBtn" value="Cancel">
</div>

`

const html2 = `
<button id="copyButton">Copy to Clipboard</button>
    <div class="info-container">
        <div class='info-section forTitle'>
            <div class='info-heading'>
                Title:
            </div>

            <div class='info-data'>
               
            </div>
        </div>

        <div class='info-section forDescription'>
            <div class='info-heading'>
                Description:
            </div>

            <div class='info-data'>
                
            </div>
        </div>

        <div class='info-section forKeyword'>
            <div class='info-heading'>
                Keyword:
            </div>

            <div class='info-data'>
              
            </div>
        </div>

        <div class='info-section forCategory'>
            <div class='info-heading'>
                Category:
            </div>

            <div class='info-data'>
               
            </div>
        </div>

        <div class='info-section forAuthorName'>
            <div class='info-heading'>
                Author Name:
            </div>

            <div class='info-data'>
            
            </div>
        </div>

        <div class='info-section forAuthorUserName'>
            <div class='info-heading'>
                Author userName:
            </div>

            <div class='info-data'>
            
            </div>
        </div>

        <div class='info-section forPublishedAt'>
            <div class='info-heading'>
                PublishedAt:
            </div>

            <div class='info-data'>
               
            </div>
        </div>

        <div class='info-section forUploadedAt'>
            <div class='info-heading'>
                UploadedAt:
            </div>

            <div class='info-data'>
                
            </div>
        </div>
    </div>
    
    <div class="info-container-loading dis-none">
        <div class="loading-window-img-container">
            <span class="loader"></span>
        </div>
        <div class="loading-window-heading">
            <h1>Purr Purr Loading...</h1>
        </div>
    </div>
    <input type="button" id="cancelBtnForGetInfo" class="operationBtn" value="Cancel">
`



setTimeout(() => {

    chrome.storage.sync.get('accessKey', function (result) {

        if (result && result.accessKey) {

            const accessKey = result.accessKey;

            let optionsWindow = document.createElement('div');
            optionsWindow.id = 'capy-optionsWindow';

            const window_container = document.createElement('div');
            window_container.innerHTML = html;
            window_container.classList.add('window-container', 'dis-none');

            const second_window_container = document.createElement('div');
            second_window_container.innerHTML = html2;
            second_window_container.classList.add('second-window-container', 'dis-none');

            optionsWindow.appendChild(window_container)
            optionsWindow.appendChild(second_window_container);
            document.body.appendChild(optionsWindow);

            let menuElement = document.querySelector('#top-row.ytd-watch-metadata');
            let downloadBtnContainers = document.createElement('div');
            downloadBtnContainers.classList.add('buttons-container');

            let downloadBtn = document.createElement('button');
            downloadBtn.textContent = "Download";
            downloadBtn.classList.add("cappy-download-buttons");
            downloadBtn.onclick = (e) => {
                show_download_window(true);
            }

            let getInfoBtn = document.createElement('button');
            getInfoBtn.textContent = "Get Info";
            getInfoBtn.classList.add("cappy-download-buttons");
            getInfoBtn.onclick = (e) => {
                getInfo(accessKey);
                show_getinfo_window(true);
            }

            downloadBtnContainers.appendChild(downloadBtn);
            downloadBtnContainers.appendChild(getInfoBtn);

            const cancelBtn = document.getElementById('cancelBtn');
            cancelBtn.onclick = (e) => {
                show_download_window(false);
                controller.abort();
            }

            const cancelBtnForGetInfo = document.getElementById('cancelBtnForGetInfo');
            cancelBtnForGetInfo.onclick = (e) => {
                show_getinfo_window(false);
            }

            const downloadMediaBtn = document.getElementById('downloadMediaBtn');
            downloadMediaBtn.onclick = (e) => {

                const media = document.querySelector('input[name="media"]:checked')?.value;
                const quality = document.querySelector('input[name="quality"]:checked')?.value;
                const audioFormat = document.querySelector('input[name="audioFormat"]:checked')?.value;
                const videoFormat = document.querySelector('input[name="videoFormat"]:checked')?.value;
                downloadMediaBtn.disabled = true;

                if(signal.aborted){
                    controller = new AbortController();
                    signal = controller.signal;
                }

                if ((media && media === 'video') && quality && videoFormat) {
                    getVideo({ videoFormat, quality }, accessKey)
                }
                else if ((media && media === 'audio') && audioFormat) {
                    getAudio({ audioFormat }, accessKey)
                }
            }

            // Add event listener for the copy button
            document.getElementById('copyButton').addEventListener('click', function () {
                var infoContainer = document.querySelector('.info-container');
                var range = document.createRange();
                range.selectNode(infoContainer);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                alert('Content copied to clipboard!');
            });

            if (menuElement) {
                menuElement.parentNode.insertBefore(downloadBtnContainers, menuElement.nextSibling);
            }
        }
    });
}, 3000)



function show_download_window(bool) {
    const window_container = document.querySelector('.window-container');
    if (bool) {

        if (window_container.classList.contains('dis-none')) {
            window_container.classList.remove('dis-none');
        }
        return;
    }
    else {
        if (!window_container.classList.contains('dis-none')) {
            window_container.classList.add('dis-none');
        }
        return;
    }
}

function show_getinfo_window(bool) {
    const second_window_container = document.querySelector('.second-window-container');
    if (bool) {
        if (second_window_container.classList.contains('dis-none')) {
            second_window_container.classList.remove('dis-none');
        }
        return;
    }
    else {
        if (!second_window_container.classList.contains('dis-none')) {
            second_window_container.classList.add('dis-none');
        }
        return;
    }
}

function show_download_window_loading(bool) {
    const download_window_loading = document.querySelector('.download-window-loading');
    const radio_options = document.querySelector('.radio-options')
    if (bool) {
        if (download_window_loading.classList.contains('dis-none')) {
            download_window_loading.classList.remove('dis-none');
            radio_options.classList.add('dis-none');
        }
        return;
    }
    else {
        if (!download_window_loading.classList.contains('dis-none')) {
            download_window_loading.classList.add('dis-none');
            radio_options.classList.remove('dis-none');
        }
        return;
    }

}

let controller = new AbortController();
let signal = controller.signal;

async function getVideo(data, accessKey) {

    try {
        chrome.runtime.sendMessage({ message: "getURL" }, function (response) {

            const tabUrl = response.url;
            show_download_window_loading(true);

            let headersList = {
                "Content-Type": "application/json"
            }
            let bodyContent = JSON.stringify({
                accessKey: accessKey
            });

            fetch(`https://capybara-yt-extension.vercel.app/api/v1/extension/downloadVideo?format=${data.videoFormat}&quality=${data.quality}&url=${tabUrl}`,
                {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                    signal: signal
                })
                .then(response => {
                    if (!response.ok) {
                        alert('Failed to download video')
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    let url = window.URL.createObjectURL(blob);

                    // A link to simulate click to download file.
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `video.${data.videoFormat}`;
                    a.click();

                    // Release the object URL after the download starts
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 100);

                    alert('Video downloaded successfully')

                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        alert('Downloading Cancelled')
                        console.log('Download aborted.');
                        return;
                    }
                })
                .finally(() => {
                    document.getElementById('downloadMediaBtn').disabled = false;
                    show_download_window_loading(false);

                })
        });
    } catch (error) {
        alert('Error on retrieving Video')
        console.error(error);
    }
}


async function getAudio(data, accessKey) {
    try {
        chrome.runtime.sendMessage({ message: "getURL" }, function (response) {
            const tabUrl = response.url;
            show_download_window_loading(true);

            let headersList = {
                "Content-Type": "application/json"
            }
            let bodyContent = JSON.stringify({
                accessKey: accessKey
            });

            fetch(`https://capybara-yt-extension.vercel.app/api/v1/extension/downloadAudio?format=${data.audioFormat}&url=${tabUrl}`,
                {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                    signal: signal
                })
                .then(response => {
                    if (!response.ok) {
                        alert('Failed to download audio')
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    let url = window.URL.createObjectURL(blob);

                    // A link to simulate click to download file.
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `audio.${data.audioFormat}`;
                    a.click();

                    // Release the object URL after the download starts
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 100);

                    alert('Audio downloaded successfully')
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        alert('Downloading Cancelled')
                        console.log('Download aborted.');
                        return;
                    }
                })
                .finally(() => {
                    document.getElementById('downloadMediaBtn').disabled = false;
                    show_download_window_loading(false);
                })
        });
    } catch (error) {
        alert('Error on retrieving audio')
        console.error(error);
    }
}

async function getInfo(accessKey) {
    try {
        chrome.runtime.sendMessage({ message: "getURL" }, function (response) {

            const tabUrl = response.url;

            show_info_container_loading(false)

            let headersList = {
                "Content-Type": "application/json"
            }
            let bodyContent = JSON.stringify({
                accessKey: accessKey,
            });

            const forTitle = document.querySelector('.forTitle');
            const forDescription = document.querySelector('.forDescription');
            const forKeyword = document.querySelector('.forKeyword');
            const forCategory = document.querySelector('.forCategory');
            const forPublishedAt = document.querySelector('.forPublishedAt');
            const forUploadedAt = document.querySelector('.forUploadedAt');
            const forAuthorName = document.querySelector('.forAuthorName');
            const forAuthorUserName = document.querySelector('.forAuthorUserName');


            fetch(`https://capybara-yt-extension.vercel.app/api/v1/extension/getInfo?url=${tabUrl}`,
                {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                })
                .then(response => {
                    if (!response.ok) {
                        alert('Failed to gather info')
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((res) => {
                    if (res && res.data) {
                        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
                        forTitle.lastElementChild.innerText = res.data.title;
                        forDescription.lastElementChild.innerText = res.data.description;
                        forKeyword.lastElementChild.innerText = res.data.keywords.join(', ');
                        forCategory.lastElementChild.innerText = res.data.category;
                        forAuthorName.lastElementChild.innerText = res.data.Author.name;
                        forAuthorUserName.lastElementChild.innerText = res.data.Author.user;
                        forPublishedAt.lastElementChild.innerText = new Intl.DateTimeFormat('en-US', options).format(new Date(res.data.publishedDate));
                        forUploadedAt.lastElementChild.innerText = new Intl.DateTimeFormat('en-US', options).format(new Date(res.data.uploadedDate));
                    }
                })
                .finally(() => {
                    show_info_container_loading(true)
                })
        });
    } catch (error) {
        alert('Error on retrieving info')
        console.error(error);
    }
}

function show_info_container_loading(bool) {

    const infoContainer = document.querySelector('.info-container');
    const infoContainerLoading = document.querySelector('.info-container-loading');
    if (bool) {
        if (infoContainer.classList.contains('dis-none')) {
            infoContainer.classList.remove('dis-none');
            infoContainerLoading.classList.add('dis-none');
        }
    }
    else {
        if (!infoContainer.classList.contains('dis-none')) {
            infoContainer.classList.add('dis-none');
            infoContainerLoading.classList.remove('dis-none');
        }
    }
}
