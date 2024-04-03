type ScriptOptions = {
  apiUrl: string;
};

interface Data {
  browserLanguage: string;
  userAgent: string;
  timezone: string;
  urlPath: string;
}

(function () {
  function init(options: ScriptOptions) {
    console.log("API URL:", options.apiUrl);
    function collectData(): void {
      const data: Data = {
        browserLanguage: navigator.language,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        urlPath: window.location.pathname,
        // IP will be collected server-side
      };
      sendData(data);
    }

    function sendData(data: Data): void {
      fetch(options.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: "cors",
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Error sending data");
          }
        })
        .catch((error) => {
          console.error("Error sending data", error);
        });
    }

    // Optionally, listen for route changes or other events
    window.addEventListener("load", collectData);
    window.addEventListener("popstate", collectData); // For SPA route changes
  }

  const options: ScriptOptions = {
    apiUrl:
      "https://d4udi08x66.execute-api.us-east-1.amazonaws.com/prod/protocol",
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init(options));
  } else {
    init(options);
  }
})();
