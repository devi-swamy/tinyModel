from crewai import Agent, LLM
import os

print("GROQ KEY:", os.getenv("GROQ_API_KEY"))
llm = LLM(
   model="groq/llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

researcher = Agent(
    role="Research Analyst",
    goal="Research the given topic thoroughly and gather key facts",
    backstory="You are an expert researcher who finds and organises information clearly.",
    llm=llm,
    verbose=True,
    max_iter=3,
    memory=False
)

writer = Agent(
    role="Content Writer",
    goal="Write a clear, concise summary based on the research provided",
    backstory="You are a skilled writer who turns raw research into readable summaries.",
    llm=llm,
    verbose=True,
    max_iter=3,
    memory=False
)
