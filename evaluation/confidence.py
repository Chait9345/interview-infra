from typing import Dict, Any

CONFIDENCE_HIGH = "HIGH"
CONFIDENCE_MEDIUM = "MEDIUM"
CONFIDENCE_LOW = "LOW"


def derive_skill_confidence(skill_result: Dict[str, Any]) -> str:
    if skill_result.get("conflicts"):
        return CONFIDENCE_LOW

    missing = len(skill_result.get("missing_evidence", []))
    used = len(skill_result.get("evidence_used", []))

    if missing == 0 and used > 0:
        return CONFIDENCE_HIGH

    if used > 0:
        return CONFIDENCE_MEDIUM

    return CONFIDENCE_LOW


def derive_overall_confidence(final_scores: Dict[str, Any]) -> Dict[str, Any]:
    confidence_counts = {
        CONFIDENCE_HIGH: 0,
        CONFIDENCE_MEDIUM: 0,
        CONFIDENCE_LOW: 0,
    }

    human_review_required = False

    for _, result in final_scores.items():
        confidence = derive_skill_confidence(result)
        result["confidence"] = confidence

        confidence_counts[confidence] += 1

        if confidence == CONFIDENCE_LOW:
            human_review_required = True

        if result.get("conflicts"):
            human_review_required = True

    total_skills = sum(confidence_counts.values())
    medium_ratio = confidence_counts[CONFIDENCE_MEDIUM] / max(total_skills, 1)

    if medium_ratio > 0.3:
        human_review_required = True

    if confidence_counts[CONFIDENCE_LOW] > 0:
        overall_confidence = CONFIDENCE_LOW
    elif confidence_counts[CONFIDENCE_MEDIUM] > 0:
        overall_confidence = CONFIDENCE_MEDIUM
    else:
        overall_confidence = CONFIDENCE_HIGH

    return {
        "overall_confidence": overall_confidence,
        "confidence_breakdown": confidence_counts,
        "human_review_required": human_review_required
    }