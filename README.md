# CollegeBuddy

 CollegeBuddy is a robust, local AI-driven university consultant platform designed for Manipal University Jaipur (MUJ).

## System Architecture

1. **Frontend**: The UI is built entirely in **React** + **Vite**, generating a responsive Chat interface. It interacts sequentially with a dedicated Python backend. Deployments are handled via GitHub Pages (`gh-pages`).
2. **Backend**: Implemented in Python using **FastAPI**. It reads robust local context data (`muj_contacts.json`) and parses it down to the engine through a custom Consultant prompt guardrail system.
3. **AI Inference**: The system completely bypasses cloud API costs. FastAPI talks securely to a local **Ollama** server running the **`llama3.2`** 3B parameter model via the official `ollama` Python client.
