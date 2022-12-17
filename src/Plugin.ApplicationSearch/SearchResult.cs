using System.Diagnostics;
using JoaLauncher.Api;

namespace ApplicationSearch;

public class ApplicationSearchResult : SearchResult
{
    public string FilePath { get; init; } = default!;
    public override void Execute(IExecutionContext executionContext)
    {
        var info = new ProcessStartInfo ( FilePath )
        {
            UseShellExecute = true
        };
        Process.Start(info);
    }
}