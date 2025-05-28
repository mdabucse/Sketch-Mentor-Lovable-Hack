import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key using environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Load the Gemini model
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def generate_process_structure(process):
    prompt = f"""
    Act as an expert Python programmer specializing in the Manim Community Edition (manimce) and an algorithm visualization specialist.

    {process}

    Your task is to generate a comprehensive, complete Python script using manimce that animates *every significant step* of the following algorithm:

    *Algorithm to Visualize: {process}*

    You must also generate a synchronized, detailed, step-by-step *voiceover script* that matches the Manim animation.

    ---

    ###  ✅ MANIM CODE REQUIREMENTS:

    1. Provide **complete code** with necessary imports, class structure, and a fully implemented `construct` method.
    2. Ensure the animation lasts **at least 90 seconds**, with thoughtful pacing and clear transitions.
    3. Animate the algorithm with:
        - Nodes (using Circle + Text)
        - Edges (using Line or Arrow)
        - Labels, Highlights, and Text Annotations
        - Transitions between logical steps using sub-scenes or grouping

    4. Visual elements to show:
        - Initialization
        - Iterative or Recursive Steps
        - State Changes (e.g., color changes, stack updates)
        - Backtracking or Termination
        - Optional: Show **two versions** of the algorithm (e.g., Recursive DFS and Iterative DFS)

    5. Add **Text annotations** such as "Visiting Node A", "Backtracking", etc. Use:
        - `.scale(0.5)` or smaller for long text to avoid overlap
        - `text.set(width=X)` or `text.scale_to_fit_width(X)` to wrap long lines automatically
        - Position texts to avoid edges (use `to_edge()` or `shift()` smartly)
        - When multiple texts accumulate and reach screen borders, **remove all previous texts using `FadeOut` or `self.clear()` before showing new ones**

    6. Consistent **color coding**:
        - YELLOW for current node
        - RED for backtracking
        - GREEN for completed
        - BLUE or GRAY for unvisited/default state

    7. Include timing:
        - Use `run_time` for all animations
        - Add `self.wait()` between steps for pacing
        - Ensure animation timing matches the narration

    ---

    ### 🎙️ VOICEOVER SCRIPT REQUIREMENTS:

    1. Start with a brief *introduction* to the algorithm and its use case.
    2. Narrate *each visual step* clearly and simply.
    3. Use teaching-style phrases:
        - "Now we visit..."
        - "Watch as we highlight..."
        - "Notice how the node turns yellow to indicate..."
        - "Here s what backtracking looks like..."
    4. At the end, give a short *summary*, and mention if an alternate version was shown.

    ---

    ### ✨ Output Format:
    - Provide the Python animation code in a ```python block.
    - Follow with the voiceover script under a heading like:

    ## Voiceover Script:

    Be verbose, structured, and assume your audience are beginner learners.
    """


    try:
        response = model.generate_content(prompt)

        # Check for candidates
        if response.candidates:
            content = response.candidates[0].content.parts[0].text
            return content.strip()
        else:
            return "No response returned. Possible safety filter activation."

    except Exception as e:
        return f"Error during Gemini generation: {str(e)}"

def manim_main(concept):
    process = generate_process_structure(concept)
    print("\nGenerated manim Code:\n")
    return process