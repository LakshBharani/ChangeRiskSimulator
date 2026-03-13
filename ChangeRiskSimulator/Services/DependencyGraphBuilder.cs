using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Simulation;

namespace ChangeRiskSimulator.Services;

public class DependencyGraphBuilder
{
    public (DependencyGraph Graph, List<string> ImpactedResources) Build(string rootResourceId)
    {
        var visited = new HashSet<string>();
        var edges = new List<GraphEdge>();

        void Traverse(string nodeId)
        {
            if (visited.Contains(nodeId))
                return;

            visited.Add(nodeId);

            if (MockInfrastructure.Dependencies.TryGetValue(nodeId, out var deps))
            {
                foreach (var dep in deps)
                {
                    edges.Add(new GraphEdge { From = nodeId, To = dep });
                    Traverse(dep);
                }
            }
        }

        Traverse(rootResourceId);

        var nodes = visited.Select(id => new GraphNode
        {
            Id = id,
            Type = GetResourceType(id)
        }).ToList();

        return (new DependencyGraph { Nodes = nodes, Edges = edges }, visited.ToList());
    }

    private string GetResourceType(string id)
    {
        var lower = id.ToLowerInvariant();
        if (lower.Contains("vm") || lower.Contains("scale-set")) return "vm";
        if (lower.Contains("db") || lower.Contains("sql") || lower.Contains("cosmos")) return "database";
        if (lower.Contains("app") || lower.Contains("api") || lower.Contains("web") ||
            lower.Contains("auth") || lower.Contains("func") || lower.Contains("gateway") ||
            lower.Contains("front-door") || lower.Contains("service-bus")) return "app";
        return "unknown";
    }
}
