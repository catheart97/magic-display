import os
from PIL import Image

def convert_images_to_jpg(folder_path):
    # Iterate through each file in the folder
    for filename in os.listdir(folder_path):
        # Build the full file path
        file_path = os.path.join(folder_path, filename)
        
        # Check if it's a file (not a directory) and an image
        if os.path.isfile(file_path):
            try:
                # Open the image file
                with Image.open(file_path) as img:
                    # Convert the image to RGB if it's not already in that mode (necessary for JPEG format)
                    if img.mode in ("RGBA", "P"):  # Convert non-RGB images (e.g., with transparency)
                        img = img.convert("RGB")
                    
                    # Create a new filename with _converted and .jpg extension
                    new_filename = os.path.splitext(filename)[0] + '.jpg'
                    new_file_path = os.path.join(folder_path, new_filename)
                    
                    # Save the image as a JPEG file
                    img.save(new_file_path, 'JPEG')
                    
                    print(f"Converted: {filename} -> {new_filename}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    folder_path = "campaigns/serenyx/diashow"
    convert_images_to_jpg(folder_path)
