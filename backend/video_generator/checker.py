# qwen_checker.py

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import tempfile
import os
import re
import subprocess

model_name = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map=device,
    trust_remote_code=True
)

def extract_code_blocks(text):
    pattern = r"```(?:python)?(.*?)```"
    matches = re.findall(pattern, text, re.DOTALL)
    return matches[0].strip() if matches else text.strip()

def check_manim_code(code):
    with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as temp_file:
        temp_file_path = temp_file.name
        temp_file.write(code.encode('utf-8'))
    try:
        result = subprocess.run(
            ['python', '-m', 'py_compile', temp_file_path],
            capture_output=True,
            text=True
        )
        os.unlink(temp_file_path)
        return (True, "") if result.returncode == 0 else (False, result.stderr)
    except Exception as e:
        os.unlink(temp_file_path)
        return False, str(e)

def validate_and_fix_code(initial_code: str, max_iterations=3):
    prompt_intro = """
You are a Manim Community Edition code reviewer.
Check this Python code for syntax, layout, animation logic, and Manim-specific issues.
If correct, reply: ✅ Code is correct
If incorrect, return the full corrected version in a Python code block.
"""
    messages = [
        {"role": "system", "content": "You are a Manim code reviewer and fixer."},
        {"role": "user", "content": f"{prompt_intro}\n\n```python\n{initial_code}\n```"}
    ]

    for i in range(max_iterations):
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = tokenizer([text], return_tensors="pt").to(device)

        generated = model.generate(
            **inputs,
            max_new_tokens=3000,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )

        generated_ids = [out[len(inp):] for inp, out in zip(inputs.input_ids, generated)]
        response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

        if "✅ Code is correct" in response:
            return None  # No change needed

        code_block = extract_code_blocks(response)
        is_valid, error = check_manim_code(code_block)
        if is_valid:
            return code_block

        # If still error, retry with feedback
        messages.append({"role": "assistant", "content": response})
        messages.append({
            "role": "user",
            "content": f"The code has the following errors:\n{error}\nPlease fix and regenerate."
        })

    return None  # If all iterations fail
