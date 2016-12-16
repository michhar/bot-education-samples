var _config = {
    CHAT_CONNECTOR: {
        APP_ID: process.env.MICROSOFT_APP_ID || "", //You can obtain an APP ID and PASSWORD here: https://dev.botframework.com/bots/new
        APP_PASSWORD: process.env.MICROSOFT_APP_PASSWORD || ""
    },
    COMPUTER_VISION_SERVICE: {
        API_URL: "https://api.projectoxford.ai/vision/v1.0/",
        API_KEY: "4c1c05b58bbe4abe9616139fe8a04783"  //You can obtain an COGNITIVE SERVICE API KEY: https://www.microsoft.com/cognitive-services/en-us/pricing
    }
};
exports.CONFIGURATIONS = _config;
