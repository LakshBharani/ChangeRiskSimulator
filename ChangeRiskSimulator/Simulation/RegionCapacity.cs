namespace ChangeRiskSimulator.Simulation;

public static class RegionCapacity
{
    public static Dictionary<string, int> CapacityUsage =
       new Dictionary<string, int>
   {
        { "eastus", 85 },
        { "westus", 60 },
        { "centralus", 40 }
   };
}
