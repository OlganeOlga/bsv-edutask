import pytest
from unittest.mock import patch
import pymongo
from pymongo.errors import WriteError
from src.util.dao import DAO

@pytest.fixture
def test_db():
    # Create a database for testing

    dao = DAO("todo")
    yield dao

    # Reset the database after each test
    dao.collection.delete_many({})

def test_create_valid_data(test_db):
    valid_data = {
        "description": "test",
        "done": False,
    }

    result = test_db.create(valid_data)

    assert result is not None
    assert "_id" in result

def test_create_missing_description(test_db):
    invalid_data = {
        "done": False,
    }

    with pytest.raises(WriteError):
        test_db.create(invalid_data)

def test_create_duplicate(test_db):
    valid_data1 = {
        "description": "test",
        "done": False,
    }

    test_db.create(valid_data1)

    valid_data2 = {
        "description": "test",
        "done": False,
    }

    with pytest.raises(WriteError):
        test_db.create(valid_data2)

def test_create_invalid_datatype(test_db):
    invalid_data = {
        "description": 123,
        "done": False,
    }

    with pytest.raises(WriteError):
        test_db.create(invalid_data)

