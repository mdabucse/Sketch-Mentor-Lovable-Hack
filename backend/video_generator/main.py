import os
from parsing import parsing_main
from manim_generator import manim_main
from preprocessor import extract_code_and_voiceover
from render import run_manim_file
from checker import validate_and_fix_code  # this will use your Qwen setup

def save_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        print(f"✅ Saved: {path}")

def main():
    # Step 1: Generate process
    process = parsing_main("Basic Integration Formulas")
    print("🔎 Parsing output:", process)

    ans = manim_main(process)
    code, trans = extract_code_and_voiceover(ans)

    # Step 2: Save to Param folder
    output_dir = "Param"
    os.makedirs(output_dir, exist_ok=True)

    code_path = os.path.join(output_dir, "code.py")
    trans_path = os.path.join(output_dir, "trans.txt")

    save_file(code_path, code)
    save_file(trans_path, trans)

    # Step 3: Validate and fix code using local Qwen model
    print("🤖 Checking Manim code with Qwen model...")
    fixed_code = validate_and_fix_code(code)

    if fixed_code:
        save_file(code_path, fixed_code)
        print("✅ Code was corrected and updated by Qwen.")
    else:
        print("✅ No issues found. Proceeding with original code.")

    # Step 4: Render
    run_manim_file(code_path)

if __name__ == "__main__":
    main()
