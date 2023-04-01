using System.Globalization;
using JoaLauncher.Api;
using JoaLauncher.Api.Injectables;

namespace Calculator;

public class CalculatorSearchResult : JoaLauncher.Api.SearchResult
{
    public required double Value { get; init; }
    public required IClipboardHelper ClipboardHelper { get; init; }
    
    public override void Execute(IExecutionContext executionContext)
    {
        ClipboardHelper.Copy(Value.ToString(CultureInfo.InvariantCulture));
    }
}