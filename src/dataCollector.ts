type ScriptOptions = {
    apiUrl: string;
};

(function() {
    function init(options: ScriptOptions) {
        console.log('API URL:', options.apiUrl);
    }

    // Placeholder for how options might be passed
    console.log(process.env.DATA_COLLECTION_URL)
    const options: ScriptOptions = {
        apiUrl: "https://d4udi08x66.execute-api.us-east-1.amazonaws.com/prod/protocol",
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init(options));
    } else {
        init(options);
    }
})();