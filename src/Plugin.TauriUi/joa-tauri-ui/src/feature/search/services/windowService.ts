import {
    appWindow,
    PhysicalPosition, primaryMonitor
} from "@tauri-apps/api/window";
import {HubConnection} from "@microsoft/signalr";
import {useEffect} from "react";
import {register, unregisterAll} from "@tauri-apps/api/globalShortcut";
import PluginCommand from "../models/pluginCommand";
import {executeSearchResult} from "../models/JoaMethods";

export const windowWidth = 600;
export const windowHeight = 60;

const showWindow = async () => {
    const monitor = await primaryMonitor();
    if(!monitor)
        return;
    const centerOfScreenX = monitor.position.x + (monitor.size.width / 2);
    const topThirdOfScreenY = monitor.position.y + (monitor.size.height / 3);
    const targetX = centerOfScreenX - (windowWidth / 2);
    const targetY = topThirdOfScreenY - (windowHeight / 2);
    const post = new PhysicalPosition(Math.floor(targetX), Math.floor(targetY));

    await appWindow.setPosition(post);
    await appWindow.show();

    await appWindow.setFocus();
}

export function useActivationKey(){
    useEffect(() => {
        unregisterAll().then();
        register("Alt+P", async () => {
            await showWindow();
        }).then();
        return () => {
            unregisterAll().then();
        }
    }, [])
}

export function executeCommand(connection: HubConnection, command: PluginCommand) {
    connection.invoke(executeSearchResult, command.commandId, "enter")
        .catch(function (err : any) {
            return console.error(err.toString());
        });
}
