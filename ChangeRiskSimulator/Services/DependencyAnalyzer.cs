using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Simulation;

namespace ChangeRiskSimulator.Services;

public class DependencyAnalyzer : IRiskAnalyzer
{
    private static int CountBlastRadius(string resourceId)
    {
        if (!MockInfrastructure.Dependencies.TryGetValue(resourceId, out var deps))
            return 0;

        int total = 0;
        foreach (var dep in deps)
        {
            total += 1;
            total += CountBlastRadius(dep);
        }
        return total;
    }

    public RiskSignal Analyze(ChangeRequest request)
    {
        int count = CountBlastRadius(request.ResourceId);

        if (count == 0)
        {
            return new RiskSignal
            {
                Name = "Dependency",
                Score = 5,
                Explanation = "No known dependencies for this resource."
            };
        }

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
            Explanation = $"Blast radius: {count} affected resource(s) (direct + transitive)."
        };
    }
}