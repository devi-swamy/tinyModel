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
    print("\n========== FINAL OUTPUT ==========")
    print(result)

if __name__ == "__main__":
    topic = input("Enter a topic to research: ")
    run(topic)