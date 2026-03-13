export interface ChangeRequest {
  resourceId: string;
  resourceType: string;
  changeType: string;
  region: string;
  environment: string;
}

export interface GraphNode {
  id: string;
  type: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface RiskSignal {
  name: string;
  score: number;
  explanation: string;
}

export interface SimulationResponse {
  riskLevel: string;
  totalScore: number;
  signals: RiskSignal[];
  impactedResources: string[];
  graph: DependencyGraph;
}
