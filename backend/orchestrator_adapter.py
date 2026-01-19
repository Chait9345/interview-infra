import json
import subprocess
import sys
from pathlib import Path


class OrchestratorExecutionError(Exception):
    pass


def run_interview_orchestrator() -> dict:
    """
    Executes orchestrator/run_interview.py as a subprocess.

    Returns:
        dict: evaluation JSON loaded from outputs/final_evaluation.json
    """

    project_root = Path(__file__).resolve().parent.parent
    orchestrator_path = project_root / "orchestrator" / "run_interview.py"
    output_file = project_root / "outputs" / "final_evaluation.json"

    if not orchestrator_path.exists():
        raise OrchestratorExecutionError("run_interview.py not found")

    try:
        subprocess.run(
            [sys.executable, str(orchestrator_path)],
            cwd=project_root,
            check=True,
        )
    except subprocess.CalledProcessError as e:
        raise OrchestratorExecutionError("Orchestrator execution failed") from e

    if not output_file.exists():
        raise OrchestratorExecutionError("Evaluation output not found")

    with open(output_file, "r", encoding="utf-8") as f:
        return json.load(f)
