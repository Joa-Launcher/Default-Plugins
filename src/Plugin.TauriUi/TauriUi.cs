using System.Diagnostics;
using JoaLauncher.Api;
using JoaLauncher.Api.Attributes;
using JoaLauncher.Api.Plugin;

namespace TauriUi;

[Plugin("TauriUi", "Interact with Github", "1.0", "Core", "")]
public class TauriUi : IUiPlugin
{
    const string PathToExe = "./joa-tauri-ui.exe";
    
    public void Start(string port)
    {
        Process.Start(PathToExe);
    }

    public void Stop()
    {
        //ToDo 
    }

    public void ConfigurePlugin(IPluginBuilder builder) { }
}