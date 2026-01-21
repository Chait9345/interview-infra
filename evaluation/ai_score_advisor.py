import json
from typing import Dict


def ai_score_advisor(transcript_bundle: Dict, rubric: Dict | None = None) -> Dict:
    """
    NON-AUTHORITATIVE AI advisory layer.
    Does NOT affect deterministic scoring.
    """

    return {
        "ai_skill_scores": {
            "dsa_problem_decomposition": {
                "score": 8,
                "confidence": "HIGH",
                "justification": "Clear step-by-step breakdown of the problem."
            },
            "dsa_complexity_awareness": {
                "score": 6,
                "confidence": "MEDIUM",
                "justification": "Correct time complexity stated but space complexity was missing."
            }
        },
        "ai_warnings": [
            "Space complexity not explicitly discussed."
        ]
    }


if __name__ == "__main__":
    dummy_input = {"answers": ["Used a loop", "Explained complexity"]}
    print(json.dumps(ai_score_advisor(dummy_input), indent=2))