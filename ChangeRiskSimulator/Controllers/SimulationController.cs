using Microsoft.AspNetCore.Mvc;
using ChangeRiskSimulator.Domain;
using ChangeRiskSimulator.Services;

namespace ChangeRiskSimulator.Controllers;

[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{
    private readonly RiskOrchestrator orchestrator = new RiskOrchestrator();

    [HttpPost("simulate-change")]
    public IActionResult SimulateChange([FromBody] ChangeRequest request)
    {
        var result = orchestrator.Evaluate(request);

        return Ok(new
        {
            riskLevel = result.riskLevel,
            totalScore = result.totalScore,
            signals = result.signals
        });
    }
}
