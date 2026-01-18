"""
Transcription Layer
-------------------
Responsibilities:
- Speech-to-Text (STT)
- NO interpretation
- NO evaluation
"""

from typing import Dict


def transcribe_audio(audio_blob: str) -> Dict:
    """
    Pure transcription.
    """

    # ---- SPEECH TO TEXT PLACEHOLDER ----
    # Replace with Whisper / Deepgram / Google STT later
    transcript_text = audio_blob.replace("[AUDIO]", "").strip()

    # ---- SIMPLE CONFIDENCE HEURISTIC ----
    confidence = 1.0 if transcript_text else 0.3

    return {
        "transcript_text": transcript_text,
        "confidence": {
            "acoustic_confidence": confidence
        },
        "flags": {
            "low_audio_quality": confidence < 0.5,
            "incomplete_capture": transcript_text == ""
        }
    }
