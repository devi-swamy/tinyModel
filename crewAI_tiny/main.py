from crewai import Crew, Process
from agents import researcher, writer
from tasks import create_tasks

def run(topic: str):
    tasks = create_tasks(topic)

    crew = Crew(
        agents=[researcher, writer],
        tasks=tasks,
        process=Process.sequential,  # Researcher → Writer (one after another)
        verbose=True
    )

    result = crew.kickoff()

    # Return structured output for both CLI and API use
    research_output = tasks[0].output.raw if tasks[0].output else ""
    writing_output = tasks[1].output.raw if tasks[1].output else str(result)

    return {
        "topic": topic,
        "research": research_output,
        "summary": writing_output,
    }

if __name__ == "__main__":
    topic = input("Enter a topic to research: ")
    output = run(topic)
    print("\n========== RESEARCH ==========")
    print(output["research"])
    print("\n========== SUMMARY ==========")
    print(output["summary"])
