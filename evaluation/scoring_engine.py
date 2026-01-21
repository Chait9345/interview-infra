import json
from typing import Dict, List


def load_rubric(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def score_skill(skill_rubric: Dict, provided_evidence: List[str]) -> Dict:
    required = set(skill_rubric["required_evidence"])
    forbidden = set(skill_rubric["explicitly_disallowed_evidence"])
    provided = set(provided_evidence)

    matched_required = required & provided
    matched_forbidden = forbidden & provided
    missing_required = required - provided

    # Conflict case
    if matched_required and matched_forbidden:
        return {
            "score": 4,
            "confidence": "LOW",
            "evidence_used": list(matched_required),
            "missing_evidence": list(missing_required),
            "conflicts": list(matched_forbidden),
            "human_review_required": True
        }

    # Forbidden evidence only
    if matched_forbidden:
        return {
            "score": 3,
            "confidence": "LOW",
            "evidence_used": [],
            "missing_evidence": list(required),
            "conflicts": list(matched_forbidden),
            "human_review_required": True
        }

    # Full evidence
    if matched_required == required:
        return {
            "score": 9,
            "confidence": "HIGH",
            "evidence_used": list(matched_required),
            "missing_evidence": [],
            "conflicts": [],
            "human_review_required": False
        }

    # Partial evidence
    if matched_required:
        return {
            "score": 6,
            "confidence": "MEDIUM",
            "evidence_used": list(matched_required),
            "missing_evidence": list(missing_required),
            "conflicts": [],
            "human_review_required": False
        }

    # No evidence
    return {
        "score": 2,
        "confidence": "LOW",
        "evidence_used": [],
        "missing_evidence": list(required),
        "conflicts": [],
        "human_review_required": True
    }


def evaluate_candidate(input_data: Dict, rubric: Dict) -> Dict:
    """
    Pure deterministic scoring engine.
    No AI, no heuristics, no ML.
    """

    results = {}
    human_review = False

    rubric_skills = {
        skill["skill_id"]: skill
        for section in rubric["sections"]
        for skill in section["skills"]
    }

    for response in input_data["responses"]:
        skill_id = response["skill_id"]
        skill_rubric = rubric_skills[skill_id]

        skill_result = score_skill(
            skill_rubric,
            response.get("evidence", [])
        )

        results[skill_id] = skill_result

        if skill_result["human_review_required"]:
            human_review = True

    overall_confidence = (
        "HIGH" if all(r["confidence"] == "HIGH" for r in results.values())
        else "MEDIUM" if not human_review
        else "LOW"
    )

    return {
        "candidate_id": input_data["candidate_id"],
        "final_scores": results,
        "overall_confidence": overall_confidence,
        "human_review_required": human_review
    }