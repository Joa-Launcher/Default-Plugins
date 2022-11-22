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

export async function showWindow() {
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
