# Capybara YouTube Video Downloader Extension

## Overview

The Capybara YouTube Video Downloader Extension is a browser extension designed for Chrome and Edge browsers. This extension allows users to easily download YouTube videos and audios directly from their browser. Users can monitor download requests from website, users can keep track of the videos and audios they've requested to download using their unique access token. This Project is highly focused on backend this is why i used view.js for frontend.

## Tech Stack -

### Frontend
- View.js engine
### Backend
- Express.js
- Mongodb


## Features

- **YouTube Video and Audio Downloading**: Download YouTube videos and audios effortlessly.
- **Access Token Authentication**: Secure access to the extension using an access token.
- **Download Monitoring From Website**: Track and monitor download requests sent by your access token.

## Installation For Capybara-extension Website

### Running Website

1. Run command to copy repo:  `git clone https://github.com/HarshGaur387R/Capybara-YT-Extension`
2. Run Command to change directory into server:  `cd Capybara-YT-Extension/server`
3. Run Command to install node modules:  `npm i`

### Initializing config.mjs file

1. Create a folder `config` in 'server' dir
2. Create a file `config.mjs` in `config`
3. Copy content of the `sample-config.mj` in `config/config.mjs` file (And dont forget to fill the reqirements like mongodb-connection-string, email and password)
4. Run Command  `nodemon ./index.mjs` for devlopment
5. Run Command `node ./index.mjs` for production

## Installation For Capybara-extension

### Running Extension For Chrome

1. Open Chrome browser.
2. Go to `chrome://extensions/`.
3. Enable `Developer mode` at the top-right corner.
4. Drag and drop the downloaded extension file into the browser window to install.

### Running Extension For Edge

1. Open Edge browser.
2. Go to `edge://extensions/`.
3. Enable `Developer mode` at the bottom-left corner.
4. Click `Load unpacked` and select the downloaded extension folder to install.

## Usage

### Access Token

- An access token is required to access the extension.
- Upon installation, you'll be prompted to enter your access token.
- If you don't have an access token, visit the capybara-extension website to generate one.

### Downloading Videos/Audios

1. Navigate to a YouTube video you wish to download.
2. Click on the Download Button.
3. Choose the desired download option (Video or Audio).

### Monitoring Download Requests

1. Access the Capybara extension by clicking on its icon in the browser toolbar.
2. Enter your access token to log in.
3. Once logged in, you can view and monitor the download requests associated from `website` with your token.

## Watch Tutorial Video For Better Understanding

1. [Click on this video link](https://youtu.be/RMETSEf99vY?si=ie2WvWERL3dB93Xm)
2. Click on view Raw.

## Troubleshooting

- For technical support, contact me [at LinkedIn](https://www.linkedin.com/in/harsh-gaur-a0b525217).

## Feedback and Support

We appreciate your feedback! If you have suggestions, feature requests, or need assistance, please don't hesitate to reach out to us.



Thank you for choosing the Capybara YouTube Video Downloader Extension! Happy downloading! 🎥🎵
