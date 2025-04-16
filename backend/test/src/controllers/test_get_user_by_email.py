import pytest
from unittest.mock import MagicMock, patch
from src.controllers.usercontroller import UserController

# Mock DAO
@pytest.fixture
def mock_dao(): 
  return MagicMock()

# Mock userController object
@pytest.fixtures
def user_controler(mock_dao):
  return UserController(dao = mock_dao())

@pytest.fixtures
def one_user():
  return {name:"Dao Duner", email:"dao.duner@domain.host"}

@pytest.fixtures
def two_users():
  return [{name:"Dao Duner", email:"dao.duner@domain.host"}, {name:"Dao1 Duner1", email:"dao.duner@domain.host"}]

@pytest.fixture
def invalid_email():
    return "invalid-email"

# TEST CASES for get_user_by_email
def test_invalid_email(user_controller, invalid_email):
  # test if ValueError rises with invalid email
  with patch('re.fullmatch', return_value=False):
            with self.assertRaises(ValueError):
                self.controller.get_user_by_email(invalid_email())

def test_valid_email_no_users(user_controller, invalid_email):
  # test if ValueError rises with invalid email
  with patch('re.fullmatch', return_value=False):
            with self.assertRaises(ValueError):
                self.controller.get_user_by_email(invalid_email())


def test_valid_email_no_users(user_controller, mock_dao):
  mock_dao().find.return_value = []

  with patch('re.fullmatch', return_value=True):
      result = self.controller.get_user_by_email("dao.duner@domain.host")
      assert result == None
      
