import json
from pathlib import Path

# Project root
BASE_DIR = Path(__file__).resolve().parent.parent
print("BASE_DIR =", BASE_DIR)


def load_json(path: Path):
    """Load a JSON file given an absolute Path"""
    print(f"[LOAD] {path.relative_to(BASE_DIR)}")
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_single_json(directory: Path, description: str) -> Path:
    """
    Find exactly one JSON file inside a directory.
    Fails loudly with clear diagnostics otherwise.
    """
    if not directory.exists():
        raise FileNotFoundError(f"{description} directory does not exist: {directory}")

    files = list(directory.iterdir())
    print(f"\n[DEBUG] Listing {description} directory:")
    for f in files:
        print(" -", f.name)

    json_files = [f for f in files if f.suffix.lower() == ".json"]

    if not json_files:
        raise FileNotFoundError(f"No .json files found in {directory}")

    if len(json_files) > 1:
        print("[WARN] Multiple JSON files found, using the first one")

    return json_files[0]


def simulate_interview(role_config, question_graph):
    print("\n========== INTERVIEW START ==========")
    print(f"Role : {role_config.get('role')}")
    print(f"Level: {', '.join(role_config.get('level', []))}")
    print("====================================")

    nodes = question_graph["nodes"]
    current_node_id = question_graph["start_node"]
    end_node_id = question_graph["end_node"]

    visited = set()

    while current_node_id and current_node_id not in visited:
        visited.add(current_node_id)

        node = nodes.get(current_node_id)
        if not node:
            print(f"[ERROR] Node '{current_node_id}' not found")
            break

        print("\n[QUESTION]")
        print(f"Section : {node['section']}")
        print(f"Prompt  : {node['prompt_id']}")
        print(f"Type    : {node['type']}")
        print(f"Level   : {node['difficulty']}")

        transitions = node.get("transitions", {})
        move_forward = transitions.get("move_forward", {})
        next_node = move_forward.get("then")

        if current_node_id == end_node_id:
            break

        current_node_id = next_node

    print("\n========== INTERVIEW END ==========")


def save_final_evaluation(evaluation_data):
    output_dir = BASE_DIR / "outputs"
    output_dir.mkdir(exist_ok=True)

    output_path = output_dir / "final_evaluation.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(evaluation_data, f, indent=2)

    print(f"\n[SAVE] Evaluation written to outputs/final_evaluation.json")


def main():
    # --- Load role config (auto-discovered) ---
    roles_dir = BASE_DIR / "configs" / "roles"
    role_file = find_single_json(roles_dir, "roles config")
    role_config = load_json(role_file)

    # --- Load question graph (auto-discovered) ---
    graphs_dir = BASE_DIR / "configs" / "question_graphs"
    graph_file = find_single_json(graphs_dir, "question graph")
    question_graph = load_json(graph_file)

    # --- Simulate interview ---
    simulate_interview(role_config, question_graph)

    # --- Load evaluation output ---
    evaluation_path = BASE_DIR / "evaluation" / "sample_evaluation_output.json"
    evaluation = load_json(evaluation_path)

    save_final_evaluation(evaluation)


if __name__ == "__main__":
    main()
