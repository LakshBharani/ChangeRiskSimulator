namespace ChangeRiskSimulator.Simulation;

public static class MockInfrastructure
{
    public static Dictionary<string, List<string>> Dependencies =
        new Dictionary<string, List<string>>
        {
            // Resource -> List of dependent resources
            { "vm-app-01", new List<string> { "app-service-01", "api-service-01" } },
            { "app-service-01", new List<string> { "sql-db-01" } },
            { "vm-batch-01", new List<string>() }
        };
}