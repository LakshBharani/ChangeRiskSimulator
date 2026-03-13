using ChangeRiskSimulator.Domain;

namespace ChangeRiskSimulator.Services;

public interface IRiskAnalyzer
{
    RiskSignal Analyze(ChangeRiskSimulator.Domain.ChangeRequest request);
}