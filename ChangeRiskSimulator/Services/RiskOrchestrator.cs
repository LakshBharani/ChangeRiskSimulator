using ChangeRiskSimulator.Domain;

namespace ChangeRiskSimulator.Services;

public class RiskOrchestrator
{
    private readonly RiskPlanner planner = new RiskPlanner();

    public (string riskLevel, int totalScore, List<RiskSignal> signals) Evaluate(ChangeRequest request)
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

        return (riskLevel, totalScore, signals);
    }
}