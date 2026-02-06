import os
import random

# Secret Spice Rack: High-end descriptors
TEXTURES = ["bioluminescent silk", "brushed obsidian", "iridescent vapors"]
LIGHTING = ["golden hour rim lighting", "cyberpunk neon flicker", "soft volumetric fog"]

def enhance_recipe(base_idea):
    """The 'Remy' logic: Taking a basic idea and making it gourmet."""
    texture = random.choice(TEXTURES)
    light = random.choice(LIGHTING)
    
    # Advanced logic: If the user mentions 'night', force neon lighting
    if "night" in base_idea.lower():
        light = "ultra-dark noir with vibrant neon highlights"
        
    return f"{base_idea}, detailed in {texture}, illuminated by {light}, 8k octane render, unreal engine 5 style"

# Update your chef_engine to use this:
def chef_engine(user_input):
    if "->" in user_input:
        parts = [p.strip() for p in user_input.split("->")]
        if parts[0] == "/cook":
            gourmet_prompt = enhance_recipe(parts[1])
            print(f"👨‍🍳 [CHEF REMY]: Adding a dash of {gourmet_prompt.split(',')[1]}...")
            print(f"✨ [FINAL RECIPE]: {gourmet_prompt}")
