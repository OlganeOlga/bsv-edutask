
import pytest
import json, os
from pymongo.errors import WriteError
from src.util.dao import DAO

class FileHandler:
    def _init_(self, filename):
        with open(filename, 'r') as readfile:
            self.file = json.load(readfile)
            
    def getContent(self):
        retun: self.file

class TestFileHandler:
    @pytest.fixture
    def sut(self):
        fabricationFilename = 'fabUser.json'
        self.json.stirng = {'Name': 'Jon'}
        with open(fabricationFilename, 'w') as outfile:
            json.dump(self.json.string, outfile)
        
        yield FileHandler(filename = fabricationFilename)  
        
        os.remove(fabricationFilename)
        
    @pytest.mark.staging
    def test_getContent(self, sut):
        content = sut.getContent()
        assert content['Name'] == self.json_string['Name']
@pytest.fixture
def dao():
    # Use a test-specific collection
    collection_name = "test_collection"
    dao = DAO(collection_name)
    # Clean up collection before/after each test
    dao.collection.delete_many({})
    yield dao
    dao.collection.delete_many({})  # cleanup after

@pytest.mark.integration
def test_create_valid_document(dao):
    data = {
        "title": "Test Task",
        "completed": False
    }
    result = dao.create(data)
    assert result["title"] == "Test Task"
    assert result["completed"] is False
    assert "_id" in result

# @pytest.mark.integration
# def test_create_invalid_document_missing_required_field(dao):
#     data = {
#         # Missing "title" or another required field from the validator
#         "completed": False
#     }
#     with pytest.raises(WriteError):
#         dao.create(data)
