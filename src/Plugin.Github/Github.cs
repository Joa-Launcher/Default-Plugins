using Github.SearchResults;
using JoaLauncher.Api;
using JoaLauncher.Api.Attributes;
using JoaLauncher.Api.Plugin;

namespace Github;

[Plugin("Github", "Interact with Github", "1.0", "Core", "")]
public class Github : IPlugin
{
    public void ConfigurePlugin(IPluginBuilder builder)
    {
        builder.AddGlobalResult(new RepositoriesSearchResult
        {
            Title = "Github Repos",
            Description = "Search for Github Repos",
            Icon = string.Empty
        });
    }
}