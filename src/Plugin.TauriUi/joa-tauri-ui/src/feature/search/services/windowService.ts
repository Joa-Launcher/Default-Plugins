import {
    appWindow,
    PhysicalPosition, primaryMonitor
} from "@tauri-apps/api/window";
export const windowWidth = 600;
export const windowHeight = 90;

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
