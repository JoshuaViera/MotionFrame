import os
from dotenv import load_dotenv
import requests

load_dotenv()
API_KEY = os.getenv("HUGGINGFACE_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
headers = {"Authorization": f"Bearer {API_KEY}"}

def generate_masterpiece(prompt):
    tactical_prompt = f"{prompt}, cinematic lighting, picasso paint bleed, high-spec wireframe"
    response = requests.post(API_URL, headers=headers, json={"inputs": tactical_prompt})
    return response.content