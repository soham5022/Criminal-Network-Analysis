import logging
from typing import Dict, List, Any, Tuple
from ..models.schemas import AttentionScoreFactor
from ..models.enums import AnalyticalPriority

logger = logging.getLogger("nexus-intel.attention_scoring_service")

class AttentionScoringService:
    def calculate_score(
        self,
        node_id: str,
        betweenness: float,
        degree: float,
        cross_community_links: int,
        communities_connected: int,
        is_in_dense_cluster: bool,
        is_involved_in_anomaly: bool,
        total_connections: int
    ) -> Tuple[int, AnalyticalPriority, List[AttentionScoreFactor]]:
        """
        Calculates normalized, explainable Analytical Attention Score (0-100).
        Every single point is explicitly justified by a transparent graph factor.
        """
        base_score = 20  # Base level for any active indexed entity
        factors: List[AttentionScoreFactor] = []

        # 1. Betweenness Centrality Contribution (Max +30 pts)
        if betweenness >= 0.50:
            pts = 30
            factors.append(AttentionScoreFactor(
                name="Betweenness Centrality",
                points=pts,
                reason=f"Top-tier structural bridge in shortest communication paths ({betweenness:.2f})."
            ))
            base_score += pts
        elif betweenness >= 0.25:
            pts = 18
            factors.append(AttentionScoreFactor(
                name="Betweenness Centrality",
                points=pts,
                reason=f"Elevated intermediary betweenness ({betweenness:.2f})."
            ))
            base_score += pts
        elif betweenness >= 0.10:
            pts = 8
            factors.append(AttentionScoreFactor(
                name="Betweenness Centrality",
                points=pts,
                reason=f"Moderate bridge capacity ({betweenness:.2f})."
            ))
            base_score += pts

        # 2. Cross-Community Reach (Max +25 pts)
        if communities_connected >= 3 or cross_community_links >= 5:
            pts = 25
            factors.append(AttentionScoreFactor(
                name="Cross-Community Connections",
                points=pts,
                reason=f"Direct links across {communities_connected} distinct network communities ({cross_community_links} bridge links)."
            ))
            base_score += pts
        elif communities_connected >= 2 or cross_community_links >= 2:
            pts = 15
            factors.append(AttentionScoreFactor(
                name="Cross-Community Connections",
                points=pts,
                reason=f"Inter-cluster association spanning {communities_connected} communities."
            ))
            base_score += pts

        # 3. Relationship Volume & High Degree (Max +15 pts)
        if total_connections >= 15 or degree >= 0.40:
            pts = 15
            factors.append(AttentionScoreFactor(
                name="High Network Degree",
                points=pts,
                reason=f"Elevated direct connectivity with {total_connections} counterparties."
            ))
            base_score += pts
        elif total_connections >= 8:
            pts = 8
            factors.append(AttentionScoreFactor(
                name="Network Degree",
                points=pts,
                reason=f"Active counterparty volume ({total_connections} links)."
            ))
            base_score += pts

        # 4. Transaction / Operational Anomaly Association (Max +15 pts)
        if is_involved_in_anomaly:
            pts = 15
            factors.append(AttentionScoreFactor(
                name="Flagged Pattern Anomaly",
                points=pts,
                reason="Directly involved in sub-threshold smurfing or temporal correlation lead."
            ))
            base_score += pts

        # 5. Dense Cluster Affiliation (Max +10 pts)
        if is_in_dense_cluster:
            pts = 10
            factors.append(AttentionScoreFactor(
                name="Dense Network Cluster",
                points=pts,
                reason="Affiliated with tightly meshed high-density operational cluster."
            ))
            base_score += pts

        # Clamp between 0 and 99 (never 100 to emphasize investigative inquiry)
        final_score = max(10, min(98, base_score))

        # Determine Priority Category
        if final_score >= 75:
            priority = AnalyticalPriority.CRITICAL
        elif final_score >= 55:
            priority = AnalyticalPriority.HIGH
        elif final_score >= 35:
            priority = AnalyticalPriority.MEDIUM
        else:
            priority = AnalyticalPriority.LOW

        return final_score, priority, factors

attention_scoring_service = AttentionScoringService()
