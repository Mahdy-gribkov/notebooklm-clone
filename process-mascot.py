import sys
from rembg import remove
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        input_img = Image.open(input_path)
        output_img = remove(input_img)
        output_img.save(output_path)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

if __name__ == "__main__":
    idle_path = r"C:\Users\User\.gemini\antigravity\brain\d3f76952-3901-4c4d-9be2-bd45ebee05ca\mascot_idle_1771711192073.png"
    thinking_path = r"C:\Users\User\.gemini\antigravity\brain\d3f76952-3901-4c4d-9be2-bd45ebee05ca\mascot_thinking_anchored_1771711343425.png"

    process_image(idle_path, "public/mascot-idle.png")
    process_image(thinking_path, "public/mascot-thinking.png")
