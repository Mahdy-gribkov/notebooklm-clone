import os
import shutil
from PIL import Image

src_dir = r"c:\Users\User\Desktop\NoteBookLM-clone\public"
backup_dir = r"c:\Users\User\Desktop\mascot-backups"

if not os.path.exists(backup_dir):
    os.makedirs(backup_dir)

keep_images = ["mascot-idle.png", "mascot-thinking.png"]

for file in os.listdir(src_dir):
    if file.startswith("mascot") and file.endswith(".png"):
        src_path = os.path.join(src_dir, file)
        
        # 1. Backup to desktop
        backup_path = os.path.join(backup_dir, file)
        shutil.copy2(src_path, backup_path)
        print(f"Backed up {file} to {backup_path}")

        # 2. Convert if it's a kept image
        if file in keep_images:
            try:
                img = Image.open(src_path)
                webp_filename = file.replace(".png", ".webp")
                webp_path = os.path.join(src_dir, webp_filename)
                # Save as WEBP with lossless/high quality to preserve transparency perfectly
                img.save(webp_path, "WEBP", quality=100, lossless=True)
                print(f"Converted {file} to {webp_filename}")
            except Exception as e:
                print(f"Failed to convert {file}: {e}")
        
        # 3. Delete original PNGs to achieve 0 bloat
        os.remove(src_path)
        print(f"Deleted original {file}")

# Clean up other potential old generated files, like mascot-test.png
test_img = os.path.join(src_dir, "mascot-test.png")
if os.path.exists(test_img):
    shutil.copy2(test_img, os.path.join(backup_dir, "mascot-test.png"))
    os.remove(test_img)
    print("Cleaned up mascot-test.png")

print("Asset pipeline complete. Zero bloat achieved.")
