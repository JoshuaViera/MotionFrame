def compute_logic(user_input):
    if "->" in user_input:
        pipeline = [p.strip() for p in user_input.split("->")]
        
        if pipeline[0] == "/cook" and len(pipeline) >= 4:
            asset = pipeline[1]
            environment = pipeline[2]
            action = pipeline[3]

            # Injecting Gourmet Spice (The 'Remy' Logic)
            texture = random.choice(TEXTURES)
            
            jensen_print(f"Loading '{asset}' with '{texture}' surfaces...")
            jensen_print(f"Simulating '{environment}' environment via Ray-Tracing...")
            
            if "Deploy Render" in action:
                final_vision = f"{asset} in {environment}, {texture}, 8k"
                jensen_print(f"🚀 [RENDER OUTPUT]: {final_vision}")
        else:
            jensen_print("Directive format: /cook -> [Asset] -> [Physics] -> [Action]")
