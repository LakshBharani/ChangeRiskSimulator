using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Simulation;

namespace ChangeRiskSimulator.Services;

public class HistoricalAnalyzer : IRiskAnalyzer
{
    public RiskSignal Analyze(ChangeRequest request)
    {
        string key = $"{request.ResourceType}:{request.ChangeType}";

        if (!HistoricalIncidents.IncidentCounts.ContainsKey(key))
        {
            return new RiskSignal
            {
                Name = "HistoricalPattern",
                Score = 5,
                Explanation = "No prior incident history found for similar changes."
            };
        }

        int incidentCount = HistoricalIncidents.IncidentCounts[key];

        int score = incidentCount switch
        {
            >= 4 => 35,
            3 => 25,
            2 => 15,
            1 => 10,
            _ => 5
        };

        return new RiskSignal
        {
            Name = "HistoricalPattern",
            Score = score,
            Explanation = $"Similar changes caused {incidentCount} prior incident(s)."
        };
    }
}