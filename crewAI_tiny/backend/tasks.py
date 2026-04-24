from crewai import Task
from agents import researcher, writer

def create_tasks(topic: str):
    research_task = Task(
        description=f"Research the topic: '{topic}'. Find 5 key facts or insights.",
        expected_output="A bullet-point list of 5 key facts about the topic.",
        agent=researcher
    )

    write_task = Task(
        description="Using the research provided, write a 150-word summary of the topic.",
        expected_output="A concise 150-word summary paragraph.",
        agent=writer,
        context=[research_task]   # Writer receives researcher's output
    )

    return [research_task, write_task]