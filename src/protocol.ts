import {IProtocolDataCollector, ProtocolDataCollector} from "./data-collector";

interface Protocol {
  q: Array<() => void>; // Array of functions that return void
  onReady: (callback: () => void) => void;
}

declare global {
  interface Window {
    PROTOCOL?: Protocol;
  }
}

(function() {
  (window as any).ProtocolDataCollector = ProtocolDataCollector;
  const PROTOCOL = (window as any)['PROTOCOL'] || {};

  (window as any)['PROTOCOL'] = PROTOCOL;
  if (window.PROTOCOL && Array.isArray(window.PROTOCOL.q)) {
    window.PROTOCOL.q.forEach(function(callback: () => void) { callback(); });
    window.PROTOCOL.q = [];
    window.PROTOCOL.onReady = function(callback: () => void) { callback(); };
  }
})();

// (function() {
//   let protocolConfig: Config
//
//   const PROTOCOL = (window as any)['PROTOCOL'] || {};
//
//   PROTOCOL.init = function(config: Config): void {
//     protocolConfig = config
//   };
//
//   PROTOCOL.startRequestGathering = function(): void {
//     captureRouteChanges();
//     logRequest(window.location.pathname, protocolConfig);
//   };
//
//   function captureRouteChanges(): void {
//     const originalPushState = history.pushState;
//     history.pushState = function(state: any, title: string, url?: string | URL): void {
//       originalPushState.apply(history, [state, title, url]);
//       logRequest(window.location.pathname, protocolConfig); // Assuming the new URL can be derived like this
//     };
//
//     window.addEventListener('popstate', function(): void {
//       logRequest(window.location.pathname, protocolConfig);
//     });
//   }
//
//   function logRequest(path: string, config: Config): void {
//     const data: RequestInformation = {
//       urlPath: path,
//       browserLanguage: navigator.language,
//       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//       userAgent: navigator.userAgent
//     }
//
//     fetch(config.url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//       mode: "no-cors",
//     })
//         .then((response) => {
//           if (!response.ok) {
//             console.error("Error sending data");
//           }
//         })
//         .catch((error) => {
//           console.error("Error sending data", error);
//         });
//   }
//
//   (window as any)['PROTOCOL'] = PROTOCOL;
//   if (window.PROTOCOL && Array.isArray(window.PROTOCOL.q)) {
//     window.PROTOCOL.q.forEach(function(callback: () => void) { callback(); });
//     window.PROTOCOL.q = [];
//     window.PROTOCOL.onReady = function(callback: () => void) { callback(); };
//   }
// })();
//