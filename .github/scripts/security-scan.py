#!/usr/bin/env python3

import subprocess
import sys
import json
import os

def run_bandit_scan(target_dir: str):
    print(f"Running Bandit security scan on {target_dir}...")
    result = subprocess.run(
        [sys.executable, "-m", "bandit", "-r", target_dir, "-f", "json"],
        capture_output=True,
        text=True,
    )
    
    if result.returncode != 0:
        print("Security issues found.")
        if result.stdout:
            try:
                data = json.loads(result.stdout)
                print(f"Found {len(data.get('results', []))} security issues")
            except json.JSONDecodeError:
                print(result.stdout)
    else:
        print("No major security issues detected.")
    
    return result.returncode

def run_npm_audit(target_dir: str):
    print(f"Running npm audit on {target_dir}...")
    result = subprocess.run(
        ["npm", "audit", "--audit-level", "moderate", "--json"],
        cwd=target_dir,
        capture_output=True,
        text=True,
    )
    
    if result.returncode != 0:
        print("NPM vulnerabilities found.")
        if result.stdout:
            try:
                data = json.loads(result.stdout)
                vuln_count = data.get('metadata', {}).get('vulnerabilities', {}).get('total', 0)
                print(f"Found {vuln_count} npm vulnerabilities")
            except json.JSONDecodeError:
                print(result.stdout)
    else:
        print("No npm vulnerabilities detected.")
    
    return result.returncode

if __name__ == "__main__":
    backend_result = 0
    frontend_result = 0
    
    if os.path.exists("backend"):
        backend_result = run_bandit_scan("backend")
    
    if os.path.exists("frontend"):
        frontend_result = run_npm_audit("frontend")
    
    sys.exit(max(backend_result, frontend_result))