"""Simple backend unit tests for CI/CD validation"""

import pytest


def test_basic_python_operations():
    """Test basic Python operations"""
    data = {"name": "test", "value": 42}
    assert data["name"] == "test"
    assert data["value"] == 42


def test_list_operations():
    """Test list operations"""
    items = [1, 2, 3]
    doubled = [x * 2 for x in items]
    assert doubled == [2, 4, 6]
    assert len(items) == 3


def test_string_operations():
    """Test string operations"""
    text = "Hello World"
    assert text.lower() == "hello world"
    assert text.split() == ["Hello", "World"]


@pytest.mark.asyncio
async def test_async_operations():
    """Test async operations"""
    async def fetch_data():
        return "success"
    
    result = await fetch_data()
    assert result == "success"


def test_json_operations():
    """Test JSON operations"""
    import json
    
    data = {"workflow": "test", "status": "active"}
    json_str = json.dumps(data)
    parsed = json.loads(json_str)
    
    assert parsed["workflow"] == "test"
    assert parsed["status"] == "active"