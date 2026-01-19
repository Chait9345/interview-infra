"""
AI Interviewer Layer
--------------------
Responsibilities:
- Text-to-Speech (TTS)
- Provide OPTIONAL, TEMPLATE-ONLY follow-up prompts

IMPORTANT:
- NO scoring
- NO evaluation
- NO state
"""

from typing import List, Dict


# ---- ALLOWED FOLLOW-UP TEMPLATES (LOCKED) ----
FOLLOW_UP_TEMPLATES = {
    "F1": "Please repeat your answer.",
    "F2": "Please speak a bit more clearly.",
    "F3": "Your response was not audible. Please repeat.",
    "F4": "Please continue your response."
}


def render_question(
    question_id: str,
    question_text: str,
    allowed_template_ids: List[str],
    followup_policy: Dict
) -> Dict:
    """
    Pure function:
    Same input -> Same output
    """

    # ---- TEXT TO SPEECH PLACEHOLDER ----
    # In real life, this would call a TTS service
    spoken_audio = f"[AUDIO] {question_text}"

    # ---- FOLLOW-UP GENERATION (SAFE & BOUNDED) ----
    followups = []

    if followup_policy.get("enabled", False):
        max_followups = followup_policy.get("max_followups", 0)

        for template_id in allowed_template_ids[:max_followups]:
            if template_id in FOLLOW_UP_TEMPLATES:
                followups.append({
                    "template_id": template_id,
                    "text": FOLLOW_UP_TEMPLATES[template_id]
                })

    return {
        "spoken_question_audio": spoken_audio,
        "optional_followups": followups,
        "metadata": {
            "question_id": question_id
        }
    }
