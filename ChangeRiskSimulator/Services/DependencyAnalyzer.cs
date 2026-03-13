using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Simulation;

namespace ChangeRiskSimulator.Services;

public class DependencyAnalyzer : IRiskAnalyzer
{
    public RiskSignal Analyze(ChangeRequest request)
    {
        if (!MockInfrastructure.Dependencies.TryGetValue(request.ResourceId, out var deps))
        {
            return new RiskSignal
            {
                Name = "Dependency",
                Score = 5,
                Explanation = "No known dependencies for this resource."
            };
        }

        int count = deps.Count;
        int score = count switch
        {
            >= 3 => 25,
            2 => 15,
            1 => 10,
            _ => 5
        };

        return new RiskSignal
        {
            Name = "Dependency",
            Score = score,
            Explanation = $"Resource has {count} dependent resource(s)."
        };
    }
}