using JoaLauncher.Api;
using JoaLauncher.Api.Enums;
using JoaLauncher.Api.Providers;

namespace Github.Providers;

public class RepositoryProvider : IProvider
{
    public List<SearchResult> SearchResults { get; set; }
    public SearchResultLifetime SearchResultLifetime { get; set; }
    public List<SearchResult> GetSearchResults(string searchString)
    {
        throw new NotImplementedException();
    }
}