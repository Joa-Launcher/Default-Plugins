using Github.Providers;
using JoaLauncher.Api;

namespace Github.SearchResults;

public class RepositorySearchResult : SearchResult
{
    public override void Execute(IExecutionContext executionContext)
    {
        executionContext.AddStepBuilder().AddProvider<RepositoryProvider>();
    }
}