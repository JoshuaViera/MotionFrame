#!/usr/bin/env python3
import os
import sys
import subprocess
import time

def print_banner():
    print("\033[1;36m")
    print("      ___           ___           ___           ___           ___     ")
    print("     /\__\         /\  \         /\  \         /\  \         /\__\    ")
    print("    /::|  |       /::\  \        \:\  \       /::\  \       /:/  /    ")
    print("   /:|:|  |      /:/\:\  \        \:\  \     /:/\:\  \     /:/  /     ")
    print("  /:/|:|__|__   /:/  \:\  \       /::\  \   /:/  \:\  \   /:/  /      ")
    print(" /:/ |::::\__\ /:/__/ \:\__\     /:/\:\__\ /:/__/ \:\__\ /:/__/       ")
    print(" \/__/~~/:/  / \:\  \ /:/  /    /:/  \/__/ \:\  \ /:/  / \:\  \       ")
    print("       /:/  /   \:\  /:/  /    /:/  /       \:\  /:/  /   \:\  \      ")
    print("      /:/  /     \:\/:/  /     \/__/         \:\/:/  /     \:\  \     ")
    print("     /:/  /       \::/  /                     \::/  /       \:\__\    ")
    print("     \/__/         \/__/                       \/__/         \/__/    ")
    print("\n             MOTIONFRAME RELEASE v3.3 | OBSIDIAN VOID")
    print("\033[0m")

def check_dependencies():
    print("Checking dependencies...")
    if not os.path.exists("node_modules"):
        print("node_modules not found. Installing...")
        subprocess.run(["npm", "install"], check=True)
    print("Dependencies verified.\n")

def run_dev():
    print("Launching MotionFrame Development Environment...")
    try:
        subprocess.run(["npm", "run", "dev"])
    except KeyboardInterrupt:
        print("\nMotionFrame shutdown complete.")

def main():
    print_banner()
    check_dependencies()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--build":
        print("Running Production Build...")
        subprocess.run(["npm", "run", "build"], check=True)
        print("Build complete. Launching Production Server...")
        subprocess.run(["npm", "start"], check=True)
    else:
        run_dev()

if __name__ == "__main__":
    main()
