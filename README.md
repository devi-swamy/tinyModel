# CrewAI TinyLlama Local Setup

This project demonstrates a simple multi-agent workflow using **CrewAI** with a locally running **TinyLlama** model via Ollama. It creates two agents—a researcher and a writer—that collaborate to research a topic and produce a concise summary.

---

## 🚀 Overview

The project uses:

* A **local LLM** (TinyLlama via Ollama)
* Two agents:

  * **Research Analyst** → gathers and organizes information
  * **Content Writer** → converts research into a clear summary

This setup is optimized for **low-spec hardware** by limiting iterations and disabling memory.

---

## 📦 Requirements

Make sure you have the following installed:

* Python 3.8+
* Ollama (running locally)
* CrewAI

---

## ⚙️ Setup

### 1. Install dependencies

```bash
pip install crewai
```

### 2. Start Ollama with TinyLlama

```bash
ollama run tinyllama
```

Ensure Ollama is running at:

```
http://localhost:11434
```

---

## 🧠 Code Explanation

### LLM Configuration

```python
llm = LLM(
    model="ollama/tinyllama",
    base_url="http://localhost:11434"
)
```

* Connects CrewAI to your local TinyLlama model via Ollama

---

### Research Agent

```python
researcher = Agent(
    role="Research Analyst",
    goal="Research the given topic thoroughly and gather key facts",
    backstory="You are an expert researcher who finds and organises information clearly.",
    llm=llm,
    verbose=True,
    max_iter=3,
    memory=False
)
```

* Focuses on collecting and structuring information
* Limited iterations for faster performance

---

### Writer Agent

```python
writer = Agent(
    role="Content Writer",
    goal="Write a clear, concise summary based on the research provided",
    backstory="You are a skilled writer who turns raw research into readable summaries.",
    llm=llm,
    verbose=True,
    max_iter=3,
    memory=False
)
```

* Converts research into a readable summary
* Designed for clarity and brevity

---

## ▶️ Usage

You can integrate these agents into a Crew workflow to:

1. Provide a topic
2. Let the researcher gather insights
3. Pass results to the writer for summarization


---

