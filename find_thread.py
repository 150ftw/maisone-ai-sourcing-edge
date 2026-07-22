from PIL import Image

img = Image.open('public/sewing-machine.png')
img = img.convert('RGBA')
width, height = img.size

# Find the right-most non-transparent pixel
right_y = -1
for x in range(width-1, -1, -1):
    for y in range(height):
        r,g,b,a = img.getpixel((x, y))
        if a > 50: # non-transparent
            right_y = y
            print(f"Right-most pixel is at x={x}, y={y} (Height is {height}, Width is {width})")
            print(f"y percentage = {y / height * 100}%")
            break
    if right_y != -1:
        break

# Find the left-most non-transparent pixel
left_y = -1
for x in range(0, width):
    for y in range(height):
        r,g,b,a = img.getpixel((x, y))
        if a > 50:
            left_y = y
            print(f"Left-most pixel is at x={x}, y={y}")
            print(f"y percentage = {y / height * 100}%")
            break
    if left_y != -1:
        break
