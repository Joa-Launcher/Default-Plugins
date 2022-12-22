import {HubConnection, HubConnectionBuilder, LogLevel, RetryContext} from "@microsoft/signalr";

let connection : HubConnection | undefined = undefined;
export function getConnection() : HubConnection {
    if(!connection){
        try {
            connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7141/searchHub")
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
                        console.log("retrying...");
                        return 1000;
                    }})
                .build();
        }catch (e) {
            throw new Error("A help");
        }
    }
    return connection;
}
