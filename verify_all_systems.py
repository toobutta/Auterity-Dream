#!/usr/bin/env python3
"""
Auterity Unified AI Platform - System Verification Script.

Verifies all three systems + integration layer are running and communicating.
"""

import sys
import time
from typing import Any, Dict

import requests

# System endpoints
SYSTEMS = {
    "AutoMatrix Backend": "http://localhost:8000",
    "AutoMatrix Frontend": "http://localhost:3000",
    "RelayCore Backend": "http://localhost:3001",
    "RelayCore Frontend": "http://localhost:3002",
    "NeuroWeaver Backend": "http://localhost:8001",
    "NeuroWeaver Frontend": "http://localhost:3003",
    "Integration Layer": "http://localhost:3002",  # Note: Same as RelayCore
    # frontend in some configs
}


def check_system_health(name: str, url: str) -> Dict[str, Any]:
    """Check if a system is healthy."""
    try:
        # Try common health check endpoints
        endpoints_to_try = [
            f"{url}/health",
            f"{url}/api/health",
            f"{url}/api/v1/health",
            f"{url}/",
        ]

        for endpoint in endpoints_to_try:
            try:
                response = requests.get(endpoint, timeout=5)
                if response.status_code == 200:
                    return {
                        "status": "✅ HEALTHY",
                        "url": endpoint,
                        "response_time": response.elapsed.total_seconds(),
                        "details": (response.text[:200] if response.text else "OK"),
                    }
            except requests.RequestException:
                continue

        return {
            "status": "❌ UNREACHABLE",
            "url": url,
            "response_time": None,
            "details": "No health endpoint responded",
        }

    except Exception as e:
        return {
            "status": "❌ ERROR",
            "url": url,
            "response_time": None,
            "details": str(e),
        }


def test_integration_endpoints():
    """Test key integration endpoints."""
    integration_tests = []

    # Test AutoMatrix → RelayCore integration
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/ai/chat",
            json={"message": "Test integration", "model": "gpt-3.5-turbo"},
            timeout=10,
        )
        integration_tests.append(
            {
                "test": "AutoMatrix → RelayCore AI Chat",
                "status": "✅ SUCCESS"
                if response.status_code in [200, 201]
                else f"❌ FAILED ({response.status_code})",
                "details": (response.text[:100] if response.text else "No response"),
            }
        )
    except Exception as e:
        integration_tests.append(
            {
                "test": "AutoMatrix → RelayCore AI Chat",
                "status": "❌ ERROR",
                "details": str(e),
            }
        )

    return integration_tests


def main():
    """Verify all systems and return exit code."""
    # print("🚀 Auterity Unified AI Platform - System Verification")
    # print("=" * 60)

    # Check all systems
    results = {}
    for name, url in SYSTEMS.items():
        # print(f"Checking {name}...")
        results[name] = check_system_health(name, url)
        time.sleep(0.5)  # Brief pause between checks

    # Display results
    # print("\n📊 SYSTEM STATUS REPORT")
    # print("=" * 60)

    healthy_count = 0
    for _name, result in results.items():
        # print(f"{result['status']} {name}")
        # print(f"   URL: {result['url']}")
        if result["response_time"]:
            # print(f"   Response Time: {result['response_time']:.3f}s")
            # print(f"   Details: {result['details']}")
            # print()

            if "HEALTHY" in result["status"]:
                healthy_count += 1

    # Test integration
    # print("🔗 INTEGRATION TESTS")
    # print("=" * 60)

    integration_results = test_integration_endpoints()
    for _test in integration_results:
        # print(f"{test['status']} {test['test']}")
        # print(f"   Details: {test['details']}")
        # print()
        pass

    # Summary
    total_systems = len(SYSTEMS)
    # print("📈 SUMMARY")
    # print("=" * 60)
    # print(f"Systems Healthy: {healthy_count}/{total_systems}")
    # print(f"Success Rate: {(healthy_count/total_systems)*100:.1f}%")

    if healthy_count == total_systems:
        # print("\n🎉 ALL SYSTEMS OPERATIONAL! Platform ready for use.")
        return 0
    elif healthy_count >= total_systems * 0.75:
        # print("\n⚠️  Most systems operational. Check failed systems above.")
        return 1
    else:
        # print("\n🚨 CRITICAL: Multiple systems down. Platform not"
        #       " operational.")
        return 2


if __name__ == "__main__":
    sys.exit(main())
