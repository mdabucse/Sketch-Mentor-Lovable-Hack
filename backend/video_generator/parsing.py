from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="deepseek-r1:1.5b",
    temperature=0.7,
)


def generate_process_structure(concept):
    prompt = f"""
    You are an expert process designer. When given a concept or topic, your task is to create a detailed, step-by-step process structure for implementing or executing that concept. The output should be clear, hierarchical, and include the following:

    1. **Overview**: A brief description of the concept and its purpose.
    2. **Key Objectives**: 2-4 main goals of the process.
    3. **Process Steps**: A numbered list of steps, each with:
       - A clear action or task.
       - A brief explanation of why this step is necessary.
       - Any tools, resources, or roles involved.
    4. **Potential Challenges**: 1-3 possible obstacles and how to mitigate them.
    5. **Expected Outcome**: What success looks like after completing the process.

    Format the response as a structured text outline, using bullet points and numbered lists for clarity. Ensure the process is practical, actionable, and tailored to the concept provided.
    Concept: {concept}
    """

    try:
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"Error during Deepseek generation: {str(e)}"

def parsing_main(concept):
    process = generate_process_structure(concept)
    print("\nGenerated Process Structure:\n")
    return process
