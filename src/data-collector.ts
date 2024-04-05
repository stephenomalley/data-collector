import Config from "./config";
import RequestInformation from "./request-information";

export interface IProtocolDataCollector {
    startRequestGathering: () => void;
    q?: (() => void)[];
    onReady?: (callback: () => void) => void;
}

export class ProtocolDataCollector implements IProtocolDataCollector {
    private protocolConfig?: Config;

    constructor(config: Config) {
        this.protocolConfig = config;
    }

    startRequestGathering(): void {
        this.captureRouteChanges();
        if (this.protocolConfig) {
            this.logRequest(window.location.pathname, this.protocolConfig);
        }
    }

    private captureRouteChanges(): void {
        const originalPushState = history.pushState;
        history.pushState = (state: any, title: string, url?: string | URL): void => {
            originalPushState.apply(history, [state, title, url]);
            if (this.protocolConfig) {
                this.logRequest(window.location.pathname, this.protocolConfig);
            }
        };

        window.addEventListener('popstate', () => {
            if (this.protocolConfig) {
                this.logRequest(window.location.pathname, this.protocolConfig);
            }
        });
    }

    private logRequest(path: string, config: Config): void {
        const data: RequestInformation = {
            urlPath: path,
            browserLanguage: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
        };

        fetch(config.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "no-cors",
        })
            .then(response => {
                if (!response.ok) {
                    console.error("Error sending data");
                }
            })
            .catch(error => {
                console.error("Error sending data", error);
            });
    }
}