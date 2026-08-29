import { CytoscapeNodeData, CytoscapeEdgeData } from '../../services/networkService';

export interface CommunityInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  entityCount: number;
  relationshipCount: number;
  keyBridge: string;
  nodeIds: string[];
}

const PALETTE = [
  { color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { color: '#f472b6', borderColor: 'rgba(244, 114, 182, 0.3)', badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  { color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.3)', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
];

/**
 * Calculates graph connectivity, degree, and betweenness approximation for every node.
 */
export function analyzeGraphTopology(
  nodes: { data: CytoscapeNodeData }[],
  edges: { data: CytoscapeEdgeData }[]
): {
  degrees: Record<string, number>;
  adjList: Record<string, Set<string>>;
  bridgeNodeId: string;
  crossCommunityCounts: Record<string, number>;
} {
  const degrees: Record<string, number> = {};
  const adjList: Record<string, Set<string>> = {};

  nodes.forEach(n => {
    degrees[n.data.id] = 0;
    adjList[n.data.id] = new Set();
  });

  edges.forEach(e => {
    if (adjList[e.data.source]) {
      adjList[e.data.source].add(e.data.target);
      degrees[e.data.source] = (degrees[e.data.source] || 0) + 1;
    }
    if (adjList[e.data.target]) {
      adjList[e.data.target].add(e.data.source);
      degrees[e.data.target] = (degrees[e.data.target] || 0) + 1;
    }
  });

  // Calculate dynamic bridge node (highest betweenness / cross-links)
  let maxBetweenness = -1;
  let bridgeNodeId = nodes[0]?.data.id || '';

  nodes.forEach(n => {
    const rawBetweenness = n.data.betweenness || 0;
    const score = rawBetweenness * 2 + (degrees[n.data.id] || 0);
    if (score > maxBetweenness) {
      maxBetweenness = score;
      bridgeNodeId = n.data.id;
    }
  });

  return { degrees, adjList, bridgeNodeId, crossCommunityCounts: {} };
}

/**
 * Dynamically partitions the graph into communities based on graph clusters and entity types.
 */
export function detectDynamicCommunities(
  nodes: { data: CytoscapeNodeData }[],
  edges: { data: CytoscapeEdgeData }[]
): CommunityInfo[] {
  if (nodes.length === 0) return [];

  const { bridgeNodeId, adjList } = analyzeGraphTopology(nodes, edges);

  // Group nodes by community tag or graph structure
  const rawCommunityMap = new Map<string, string[]>();

  nodes.forEach(n => {
    if (n.data.id === bridgeNodeId && nodes.length > 3) {
      return; // Bridge node connects across communities
    }

    let commKey = typeof n.data.community === 'string' && n.data.community !== ''
      ? n.data.community 
      : n.data.type === 'ACCOUNT' 
      ? 'Financial Ring' 
      : n.data.type === 'PHONE' || n.data.type === 'PERSON'
      ? 'Communication Cell'
      : n.data.type === 'LOCATION' || n.data.type === 'VEHICLE'
      ? 'Logistics Grid'
      : 'External Ring';

    if (!rawCommunityMap.has(commKey)) {
      rawCommunityMap.set(commKey, []);
    }
    rawCommunityMap.get(commKey)!.push(n.data.id);
  });

  const communities: CommunityInfo[] = [];
  let idx = 0;

  rawCommunityMap.forEach((nodeIds, commName) => {
    const palette = PALETTE[idx % PALETTE.length];
    
    // Count internal and cross links for this community
    const nodeSet = new Set(nodeIds);
    let edgeCount = 0;
    edges.forEach(e => {
      if (nodeSet.has(e.data.source) || nodeSet.has(e.data.target)) {
        edgeCount++;
      }
    });

    const category = commName.includes('Communication') ? 'Communication'
      : commName.includes('Financial') ? 'Financial'
      : commName.includes('Logistics') ? 'Logistics'
      : 'Operational';

    communities.push({
      id: `COMM_0${idx + 1}`,
      name: `COMMUNITY 0${idx + 1} — ${category.toUpperCase()}`,
      category: category,
      description: `Indexed cluster containing ${nodeIds.length} connected entities.`,
      color: palette.color,
      borderColor: palette.borderColor,
      badgeBg: palette.badgeBg,
      entityCount: nodeIds.length,
      relationshipCount: edgeCount,
      keyBridge: bridgeNodeId,
      nodeIds: nodeIds
    });

    idx++;
  });

  return communities;
}

/**
 * Calculates dynamic layout coordinates for Cytoscape.
 * Positions the dynamic bridge node at (0, 0) and arranges community clusters radially.
 */
export function getDynamicCommunityPositions(
  nodes: { data: CytoscapeNodeData }[],
  edges: { data: CytoscapeEdgeData }[]
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  if (nodes.length === 0) return positions;

  const { bridgeNodeId } = analyzeGraphTopology(nodes, edges);
  const communities = detectDynamicCommunities(nodes, edges);

  // Position primary bridge at (0, 0)
  if (bridgeNodeId) {
    positions[bridgeNodeId] = { x: 0, y: 0 };
  }

  const numCommunities = Math.max(1, communities.length);
  const radius = 220; // Distance from center

  communities.forEach((comm, commIdx) => {
    // Calculate cluster centroid angle
    const angle = (2 * Math.PI * commIdx) / numCommunities - Math.PI / 2;
    const centerX = Math.round(radius * Math.cos(angle));
    const centerY = Math.round(radius * Math.sin(angle));

    const clusterNodes = comm.nodeIds.filter(id => id !== bridgeNodeId);
    const count = clusterNodes.length;

    clusterNodes.forEach((nodeId, nIdx) => {
      if (count === 1) {
        positions[nodeId] = { x: centerX, y: centerY };
      } else {
        const subAngle = (2 * Math.PI * nIdx) / count;
        const subRadius = 60 + Math.min(60, count * 8);
        positions[nodeId] = {
          x: Math.round(centerX + subRadius * Math.cos(subAngle)),
          y: Math.round(centerY + subRadius * Math.sin(subAngle))
        };
      }
    });
  });

  // Fallback for any unpositioned nodes
  nodes.forEach((n, i) => {
    if (!positions[n.data.id]) {
      const fallbackAngle = (2 * Math.PI * i) / nodes.length;
      positions[n.data.id] = {
        x: Math.round(180 * Math.cos(fallbackAngle)),
        y: Math.round(180 * Math.sin(fallbackAngle))
      };
    }
  });

  return positions;
}

/**
 * Calculates a mathematically consistent, deterministic Attention Score (0-100)
 * where the sum of factor breakdown points is strictly identical to the final score.
 */
export function calculateAttentionScore(
  entityId: string,
  betweenness: number = 0.5,
  degree: number = 6,
  crossLinks: number = 2,
  alertCount: number = 1,
  priority: string = 'HIGH'
): { score: number; factors: Array<{ factor: string; points: string; reason: string }> } {
  // 1. Betweenness Points (0 - 30)
  const betweennessPoints = Math.round(Math.min(30, Math.max(5, betweenness * 50)));

  // 2. Cross-Community Links Points (0 - 25)
  const crossLinksPoints = Math.round(Math.min(25, Math.max(5, crossLinks * 3.5)));

  // 3. Degree Points (0 - 20)
  const degreePoints = Math.round(Math.min(20, Math.max(4, degree * 1.4)));

  // 4. Alert Points (0 - 15)
  const alertPoints = alertCount > 0 ? 15 : 0;

  // 5. Priority Points (0 - 10)
  const priorityPoints = priority === 'CRITICAL' ? 10 : priority === 'HIGH' ? 8 : 5;

  const totalScore = Math.min(100, betweennessPoints + crossLinksPoints + degreePoints + alertPoints + priorityPoints);

  const factors = [
    {
      factor: 'Betweenness Centrality',
      points: `+${betweennessPoints}`,
      reason: `Structural bridge score (${betweenness.toFixed(2)}) across communication pathways.`
    },
    {
      factor: 'Cross-Community Links',
      points: `+${crossLinksPoints}`,
      reason: `${crossLinks} cross-group connections across modularity clusters.`
    },
    {
      factor: 'Network Degree Connectivity',
      points: `+${degreePoints}`,
      reason: `Direct interaction with ${degree} counterparties.`
    }
  ];

  if (alertPoints > 0) {
    factors.push({
      factor: 'Active Investigative Alert',
      points: `+${alertPoints}`,
      reason: `${alertCount} associated investigative anomaly leads flagged.`
    });
  }

  factors.push({
    factor: 'Analytical Priority Level',
    points: `+${priorityPoints}`,
    reason: `Classified as ${priority} analytical priority.`
  });

  return { score: totalScore, factors };
}
