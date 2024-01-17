chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.url.includes('youtube.com')) {
            if (request.generateTranscribe) {
                console.log(request.url);
                await generateComments(request.url)
            }
        }
    }
)

async function generateComments(url){
    return ;
}
