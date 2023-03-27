using System.Text.Json;
using JoaLauncher.Api.Attributes;
using JoaLauncher.Api.Injectables;

namespace BookmarksSearch;

public class Browser
{
    [SettingProperty]
    public required string Name { get; set; } = null!;

    [SettingProperty]
    public bool Enabled { get; set; }

    [SettingProperty]
    public required string Location { get; set; } = null!;
    
    [SettingProperty]
    public required string BrowserLocation { get; set; } = null!;

    public List<Bookmark> GetBookmarks(IJoaLogger joaLogger)
    {
        var bookmarkLocation =
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + Location;

        if (!File.Exists(bookmarkLocation))
            return new List<Bookmark>();

        var content = File.ReadAllText(bookmarkLocation);

        var bookmarksFile = JsonSerializer.Deserialize<FileModel>(content);

        if (bookmarksFile is null)
            return new List<Bookmark>();

        return bookmarksFile.roots.bookmark_bar.children;
    }
}