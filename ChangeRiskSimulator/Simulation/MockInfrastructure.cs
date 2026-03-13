namespace ChangeRiskSimulator.Simulation;

/// <summary>
/// Mock Azure infrastructure for Change Risk simulation.
/// Maps resource ID to resources directly impacted when that resource is changed.
/// Uses human-readable names that follow realistic cloud patterns.
/// </summary>
public static class MockInfrastructure
{
    public static Dictionary<string, List<string>> Dependencies =
        new Dictionary<string, List<string>>
        {
            // Ingress: Front Door distributes traffic to backends
            { "front-door-prod", new List<string> { "web-app-main", "api-gateway" } },

            // Shared compute: App Service Plan hosts multiple apps (high blast radius)
            { "app-service-plan-eastus", new List<string> { "web-app-main", "api-gateway", "auth-service" } },
            { "app-service-plan-westus", new List<string> { "api-gateway-west" } },

            // Web & API tier
            { "web-app-main", new List<string> { "api-gateway" } },
            { "api-gateway", new List<string> { "sql-database-main", "redis-cache", "key-vault-secrets" } },
            { "api-gateway-west", new List<string> { "sql-database-main", "redis-cache" } },
            { "auth-service", new List<string> { "sql-database-main", "redis-cache", "key-vault-secrets" } },

            // Data tier
            { "sql-database-main", new List<string> { "storage-backups" } },
            { "cosmos-db-events", new List<string> { "storage-backups" } },
            { "redis-cache", new List<string>() },
            { "key-vault-secrets", new List<string>() },

            // Storage
            { "storage-backups", new List<string>() },
            { "storage-exports", new List<string>() },

            // Messaging & serverless
            { "service-bus-orders", new List<string> { "function-order-processor" } },
            { "function-order-processor", new List<string> { "sql-database-main", "storage-exports" } },

            // IaaS / batch
            { "vm-scale-set-batch", new List<string> { "service-bus-orders" } },
            { "vm-scale-set-reporting", new List<string> { "sql-database-main" } },
        };
}
