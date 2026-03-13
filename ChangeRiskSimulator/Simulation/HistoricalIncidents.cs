namespace ChangeRiskSimulator.Simulation;

public static class HistoricalIncidents
{
    public static Dictionary<string, int> IncidentCounts =
        new Dictionary<string, int>
        {
            // Key format: "ResourceType:ChangeType"
            { "VirtualMachine:Resize", 3 },
            { "VirtualMachine:Restart", 1 },
            { "NetworkSecurityGroup:ModifyRule", 4 },
            { "SQLDatabase:Scale", 2 }
        };
}