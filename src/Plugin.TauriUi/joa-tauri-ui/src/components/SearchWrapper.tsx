import Search from "./Search";
import {HubConnectionBuilder, HubConnectionState, RetryContext} from "@microsoft/signalr";
import {useEffect, useState} from "react";
import {register, unregisterAll} from "@tauri-apps/api/globalShortcut";
import {showWindow} from "../services";

const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7141/searchHub")
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
            console.log("retrying...");
            return 1000;
        }})
    .build();

const SearchWrapper = () => {
    const [connectionState, setConnectionState ] = useState(false);

    useEffect(() => {
        console.log("starting connection")
        connection.start().then(() => {
            console.log("finished starting connection")
            setConnectionState(true);
            connection.onreconnected(() => {
                setConnectionState(true);
            });

            connection.onclose(() => {
                setConnectionState(false);
            });

            connection.onreconnecting(() => {
                setConnectionState(false);
            });

        }).catch();


        unregisterAll().then();
        register("Alt+P", async () => {
            await showWindow();
        }).then();

        return () => {
            connection.stop().then(() => {
                setConnectionState(false);
            });
            unregisterAll().then();
        }
    }, []);

    useEffect(() => {
        console.log("rerendefring");
    })

    return (
        <div>
            { connectionState && <Search connection={connection}/>}
        </div>
    );
}

export default SearchWrapper;
