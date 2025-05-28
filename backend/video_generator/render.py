import subprocess
import os

def run_manim_file(file_path, scene_name=None, output_format="mp4"):
    """
    Runs a Manim .py file to generate an animation.

    Parameters:
        file_path (str): Full path to the .py file containing Manim code.
        scene_name (str, optional): The specific scene to render. If None, renders all scenes.
        output_format (str): Output format, e.g., "mp4", "gif".

    Returns:
        None
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File '{file_path}' does not exist.")
    
    # Construct the command
    cmd = ["manim", file_path]

    if scene_name:
        cmd.append(scene_name)

    cmd += ["-pql"]  # -p: preview, -ql: quick low quality (you can change this)
    
    if output_format.lower() == "gif":
        cmd.append("--format=gif")

    print("Running command:", " ".join(cmd))
    
    # Run the command
    subprocess.run(cmd, check=True)

# Example usage:
# run_manim_file("your_animation.py", scene_name="MyScene")
