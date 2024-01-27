// content.js

const html = `<div class="window-container">
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

<div class="operationsBtnContainer">
    <input type="button" id="downloadMediaBtn" class="operationBtn" value="Download">
    <input type="button" id="cancelBtn" class="operationBtn" value="Cancel">
</div>
</div>`


setTimeout(() => {

    chrome.storage.sync.get('accessKey', function (result) {

        if (result && result.accessKey) {

            const accessKey = result.accessKey;

            const optionsWindow = document.createElement('div');
            optionsWindow.innerHTML = html;

            // filter-window-options-container
            const filter_window_options_container = document.createElement('div');
            filter_window_options_container.classList.add('filter-window-options-container', 'hide-window');
            filter_window_options_container.appendChild(optionsWindow);

            document.body.appendChild(filter_window_options_container);

            let menuElement = document.querySelector('#top-row.ytd-watch-metadata');
            let downloadBtnContainers = document.createElement('div');
            downloadBtnContainers.classList.add('buttons-container');
            let downloadBtn = document.createElement('button');
            downloadBtn.textContent = "Download";

            downloadBtn.onclick = (e) => {
                filter_window_options_container.classList.remove('hide-window');
                filter_window_options_container.classList.add('show-window');
            }
            downloadBtn.classList.add("cappy-download-buttons");

            let getInfoBtn = document.createElement('button');
            getInfoBtn.textContent = "Get Info";
            getInfoBtn.classList.add("cappy-download-buttons");

            downloadBtnContainers.appendChild(downloadBtn);
            downloadBtnContainers.appendChild(getInfoBtn);

            const cancelBtn = document.getElementById('cancelBtn');
            cancelBtn.onclick = (e) => {
                filter_window_options_container.classList.remove('show-window');
                filter_window_options_container.classList.add('hide-window');
            }

            const downloadMediaBtn = document.getElementById('downloadMediaBtn');
            downloadMediaBtn.onclick = (e) => {

                const media = document.querySelector('input[name="media"]:checked')?.value;
                const quality = document.querySelector('input[name="quality"]:checked')?.value;
                const audioFormat = document.querySelector('input[name="audioFormat"]:checked')?.value;
                const videoFormat = document.querySelector('input[name="videoFormat"]:checked')?.value;

                if ((media && media === 'video') && quality && videoFormat) {
                    getVideo({ videoFormat, quality });
                }
                else if ((media && media === 'audio') && audioFormat) {
                    getAudio({ audioFormat });
                }
            }

            if (menuElement) {
                menuElement.parentNode.insertBefore(downloadBtnContainers, menuElement.nextSibling);
            }
        }
    });
}, 3000)


async function getVideo(data) {

    try {
        chrome.runtime.sendMessage({ message: "getURL" }, function (response) {

            const tabUrl = response.url;

            fetch(`http://localhost:5000/api/v1/extension/downloadVideo?format=${data.videoFormat}&quality=${data.quality}&url=${tabUrl}`)
                .then(response => {
                    if (!response.ok) {
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

                });
        });
    } catch (error) {
        alert('Error on retrieving Video')
        console.log(error);
    }
}


async function getAudio(data) {

    try {
        chrome.runtime.sendMessage({ message: "getURL" }, function (response) {

            const tabUrl = response.url;

            fetch(`http://localhost:5000/api/v1/extension/downloadAudio?format=${data.audioFormat}&url=${tabUrl}`)
                .then(response => {
                    if (!response.ok) {
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
                });
        });
    } catch (error) {
        alert('Error on retrieving audio')
        console.log(error);
    }
}




