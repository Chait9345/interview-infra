import json
from evaluation.scoring_engine import load_rubric, evaluate_candidate
from evaluation.confidence import derive_overall_confidence

# Load rubric
rubric = load_rubric(
    "configs/rubrics/swe_rubric.json"
)

# Load candidate input
with open("evaluation/sample_input.json") as f:
    candidate_input = json.load(f)

# Deterministic scoring
scoring_output = evaluate_candidate(candidate_input, rubric)

# Confidence layer
confidence_result = derive_overall_confidence(scoring_output["final_scores"])
scoring_output.update(confidence_result)

print(json.dumps(scoring_output, indent=2))