namespace ChangeRiskSimulator.Domain;

public class ChangeRequest
{
    public string ResourceId { get; set; }
    public string ResourceType { get; set; }
    public string ChangeType { get; set; }
    public string Region { get; set; }
}