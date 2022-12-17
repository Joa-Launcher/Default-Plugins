using JoaLauncher.Api;
using JoaLauncher.Api.Enums;
using JoaLauncher.Api.Providers;

namespace Github.Providers;

public class RepositoriesProvider : IProvider
{
    public List<SearchResult> SearchResults { get; set; }
    public SearchResultLifetime SearchResultLifetime { get; set; }
    public List<SearchResult> GetSearchResults(string searchString)
    {
        return new List<SearchResult>();
    }
}