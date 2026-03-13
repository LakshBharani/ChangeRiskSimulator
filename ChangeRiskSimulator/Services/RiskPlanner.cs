using ChangeRiskSimulator.Domain;

namespace ChangeRiskSimulator.Services;

public class RiskPlanner
{
    public List<IRiskAnalyzer> Plan(ChangeRequest request)
    {
        var analyzers = new List<IRiskAnalyzer>();

        analyzers.Add(new EnvironmentAnalyzer());

        if (request.ResourceType == "VirtualMachine")
        {
            analyzers.Add(new DependencyAnalyzer());
            analyzers.Add(new CapacityAnalyzer());
            analyzers.Add(new HistoricalAnalyzer());
        }
        else if (request.ResourceType == "NetworkSecurityGroup")
        {
            analyzers.Add(new DependencyAnalyzer());
            analyzers.Add(new HistoricalAnalyzer());
        }
        else
        {
            analyzers.Add(new HistoricalAnalyzer());
        }

        return analyzers;
    }
}