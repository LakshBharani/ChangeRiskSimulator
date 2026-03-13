namespace ChangeRiskSimulator.Domain;

public class DependencyGraph
{
    public List<GraphNode> Nodes { get; set; } = new();
    public List<GraphEdge> Edges { get; set; } = new();
}

public class GraphNode
{
    public string Id { get; set; }
    public string Type { get; set; }
}

public class GraphEdge
{
    public string From { get; set; }
    public string To { get; set; }
}
