﻿using JoaLauncher.Api;
using JoaLauncher.Api.Injectables;
using JoaLauncher.Api.Plugin;
using JoaLauncher.Api.Providers;

namespace BookmarksSearch;

public class BookmarksSearch : ICache, IProvider, IPlugin
{
    private readonly Setting _setting;
    private readonly IJoaLogger _joaLogger;
    private readonly IIconHelper _iconHelper;
    private List<SearchResult> _searchResults = new();

    public BookmarksSearch(Setting setting, IJoaLogger joaLogger, IIconHelper iconHelper)
    {
        _setting = setting;
        _joaLogger = joaLogger;
        _iconHelper = iconHelper;
    }

    public void UpdateIndexes()
    {
        _searchResults.Clear();

        var bookmarks = _setting.Browsers.Where(x => x.Enabled)
            .SelectMany(browser => browser.GetBookmarks(_joaLogger)
                .Select(bookmark => (bookmark, browser)))
            .DistinctBy(x => x.bookmark.url).ToList();

        _searchResults = bookmarks.Select(x => new SerachResult
        {
            Title = x.bookmark.name,
            Description = x.bookmark.url,
            Icon = _iconHelper.CreateIconFromFileIfNotExists<BookmarksSearch>(x.browser.BrowserLocation)
        }).Cast<SearchResult>().ToList();
    }

    public List<SearchResult> GetSearchResults(string searchString)
    {
        return _searchResults;
    }

    public void ConfigurePlugin(IPluginBuilder builder)
    {
        builder.AddGlobalProvider<BookmarksSearch>();
    }
}