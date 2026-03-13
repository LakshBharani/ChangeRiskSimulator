using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Simulation;

namespace ChangeRiskSimulator.Services;

public class CapacityAnalyzer : IRiskAnalyzer
{
    public RiskSignal Analyze(ChangeRequest request)
    {
        if (!RegionCapacity.CapacityUsage.ContainsKey(request.Region))
        {
            return new RiskSignal
            {
                Name = "RegionCapacity",
                Score = 10,
                Explanation = "Unknown region capacity."
            };
        }

        int usage = RegionCapacity.CapacityUsage[request.Region];

        int score = usage switch
        {
            > 80 => 30,
            > 60 => 20,
            > 40 => 10,
            _ => 5
        };

        return new RiskSignal
        {
            Name = "RegionCapacity",
            Score = score,
            Explanation = $"Region utilization at {usage}%."
        };
    }
}