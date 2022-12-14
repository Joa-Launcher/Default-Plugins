using JoaLauncher.Api;
using JoaLauncher.Api.Attributes;

namespace BookmarksSearch;

public class Setting : ISetting
{
    [SettingProperty]
    public List<Browser> Browsers { get; set; } = new()
    {
        DefaultBrowsers.Chrome,
        DefaultBrowsers.Firefox,
        DefaultBrowsers.Brave,
        DefaultBrowsers.Edge
    };
}