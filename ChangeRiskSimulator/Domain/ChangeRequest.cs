namespace ChangeRiskSimulator.Domain;

public class ChangeRequest
{
    public required string ResourceId { get; set; }
    public required string ResourceType { get; set; }
    public required string ChangeType { get; set; }
    public required string Region { get; set; }
    public required string Environment { get; set; }
}