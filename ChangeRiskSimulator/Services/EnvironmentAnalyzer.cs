using ChangeRiskSimulator.Domain;

namespace ChangeRiskSimulator.Services;

public class EnvironmentAnalyzer : IRiskAnalyzer
{
    public RiskSignal Analyze(ChangeRequest request)
    {
        var env = request.Environment?.Trim().ToLowerInvariant() ?? "dev";

        var (score, explanation) = env switch
        {
            "production" => (40, "Production environment — high impact."),
            "staging" => (15, "Staging environment — moderate impact."),
            "dev" => (5, "Dev environment — low impact."),
            _ => (5, $"Unknown environment '{request.Environment}' treated as Dev.")
        };

        return new RiskSignal
        {
            Name = "Environment",
            Score = score,
            Explanation = explanation
        };
    }
}
