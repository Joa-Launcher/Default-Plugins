using JoaLauncher.Api.Attributes;
using OperatingSystem = JoaLauncher.Api.Enums.OperatingSystem;

namespace ApplicationSearch;

public record Folder
{
    [Path]
    [SettingProperty]
    public string Path { get; init; } = default!;

    [OperatingSystem]
    [SettingProperty]
    public OperatingSystem OperatingSystem { get; init; }
}