## Demo Interview Orchestrator

This is a deterministic, demo-only interview orchestrator.

### What it demonstrates

- Interview logic is defined as data (JSON)
- Interviews are executed deterministically
- Evaluation is generated separately and handed to humans
- No AI, ML, or probabilistic logic is embedded

### What this is NOT

- Not a production engine
- Not an AI model
- Not a chatbot

### Why this exists

To prove that interviews can be treated as programmable infrastructure.

### How to run

```bash
python orchestrator/run_interview.py
