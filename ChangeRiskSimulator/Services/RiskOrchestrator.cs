using ChangeRiskSimulator.Domain;

namespace ChangeRiskSimulator.Services;

public class RiskOrchestrator
{
    private readonly RiskPlanner planner = new RiskPlanner();
    private readonly DependencyGraphBuilder graphBuilder = new DependencyGraphBuilder();

    public (string riskLevel, int totalScore, List<RiskSignal> signals, List<string> impactedResources, DependencyGraph graph) Evaluate(ChangeRequest request)
    {
        var analyzers = planner.Plan(request);

        var signals = new List<RiskSignal>();

        foreach (var analyzer in analyzers)
        {
            signals.Add(analyzer.Analyze(request));
        }

        int totalScore = signals.Sum(s => s.Score);

        string riskLevel = totalScore switch
        {
            <= 30 => "Low",
            <= 70 => "Medium",
            _ => "High"
        };

        var (graph, impactedResources) = graphBuilder.Build(request.ResourceId);

        return (riskLevel, totalScore, signals, impactedResources, graph);
    }
}