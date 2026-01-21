# ============================================================
# PERMANENT PYTHON PATH FIX (DO NOT REMOVE)
# ============================================================
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

# ============================================================
# STANDARD IMPORTS
# ============================================================
import json

# ============================================================
# AI RUNTIME (ASSISTIVE ONLY – NOT SCORING)
# ============================================================
from interview_runtime.ai_layer.ai_interviewer import render_question
from interview_runtime.ai_layer.transcription import transcribe_audio

# ============================================================
# EVALUATION (PURE / DETERMINISTIC)
# ============================================================
from evaluation.scoring_engine import evaluate_candidate
from evaluation.confidence import derive_overall_confidence
from evaluation.ai_score_advisor import ai_score_advisor

# ============================================================
# PROJECT ROOT
# ============================================================
BASE_DIR = ROOT_DIR
print("BASE_DIR =", BASE_DIR)


# ============================================================
# UTILS
# ============================================================
def load_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_final_evaluation(payload: dict):
    out_dir = BASE_DIR / "outputs"
    out_dir.mkdir(exist_ok=True)

    out_path = out_dir / "final_evaluation.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"\n[SAVE] outputs/final_evaluation.json")


# ============================================================
# INTERVIEW LOOP
# ============================================================
def simulate_interview(role_config: dict, question_graph: dict) -> dict:
    print("\n========== INTERVIEW START ==========")
    print("Role :", role_config["role"])
    print("Level:", ", ".join(role_config["level"]))
    print("====================================")

    evaluation_input = {
        "candidate_id": "CAND_SIM_001",
        "role": role_config["role"],
        "level": role_config["level"],
        "responses": []
    }

    nodes = question_graph["nodes"]
    current_node_id = question_graph["start_node"]
    end_node_id = question_graph["end_node"]

    visited = set()

    while current_node_id and current_node_id not in visited:
        visited.add(current_node_id)
        node = nodes[current_node_id]

        print("\n[QUESTION]")
        print("Node      :", current_node_id)
        print("Section   :", node["section"])
        print("Skill ID  :", node["skill_id"])
        print("Prompt    :", node["prompt_id"])
        print("Difficulty:", node["difficulty"])

        ai_q = render_question(
            question_id=current_node_id,
            question_text=node["prompt_id"],
            allowed_template_ids=["F1"],
            followup_policy={
                "enabled": False,
                "max_followups": 0
            }
        )

        print("\n[AI SPEAKS]")
        print(ai_q["spoken_question_audio"])

        candidate_text = input("\nCandidate says: ")
        transcript = transcribe_audio(f"[AUDIO] {candidate_text}")

        print("\n[TRANSCRIPTION]")
        print("Text :", transcript["transcript_text"])

        # -------------------------------
        # BUILD DETERMINISTIC EVIDENCE
        # -------------------------------
        evidence = []

        if "because" in transcript["transcript_text"].lower():
            evidence.append("Clear articulation of reasoning")

        if any(k in transcript["transcript_text"].lower() for k in ["o(", "time complexity"]):
            evidence.append("Stated time complexity")

        evaluation_input["responses"].append({
            "node_id": current_node_id,
            "section_id": node["section"],
            "skill_id": node["skill_id"],
            "evidence": evidence
        })

        if current_node_id == end_node_id:
            break

        current_node_id = node["transitions"]["move_forward"]["then"]

    print("\n========== INTERVIEW END ==========")
    return evaluation_input


# ============================================================
# MAIN
# ============================================================
def main():
    # -----------------------------
    # LOAD CONFIGS (EXPLICIT)
    # -----------------------------
    role_config = load_json(
        BASE_DIR / "configs" / "roles" / "swe_entry_mid.json"
    )

    question_graph = load_json(
        BASE_DIR / "configs" / "question_graphs" / "swe_graph.json"
    )

    rubric = load_json(
        BASE_DIR / "configs" / "rubrics" / "swe_rubric.json"
    )

    # -----------------------------
    # RUN INTERVIEW
    # -----------------------------
    evaluation_input = simulate_interview(role_config, question_graph)

    # -----------------------------
    # DETERMINISTIC SCORING
    # -----------------------------
    scoring_output = evaluate_candidate(evaluation_input, rubric)
    confidence_output = derive_overall_confidence(scoring_output["final_scores"])
    scoring_output.update(confidence_output)

    # -----------------------------
    # AI ADVISORY (NON-AUTHORITATIVE)
    # -----------------------------
    ai_advisory = ai_score_advisor(
        transcript_bundle=evaluation_input
    )

    # -----------------------------
    # FINAL OUTPUT
    # -----------------------------
    final_payload = {
        "deterministic_scores": scoring_output,
        "ai_advisory": ai_advisory
    }

    save_final_evaluation(final_payload)


if __name__ == "__main__":
    main()