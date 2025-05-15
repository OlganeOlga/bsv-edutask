import pytest
# use fixtures
from unittest.mock import MagicMock

# import for testing printed output
import io
import sys

# import UserController to test it's method
from src.controllers.usercontroller import UserController

# Mock DAO
@pytest.fixture
def mock_dao(): 
  return MagicMock()

# Mock userController object
@pytest.fixture
def user_controller(mock_dao):
  return UserController(dao = mock_dao)

@pytest.fixture
def one_user():
    user = MagicMock()
    user.firstName = "Dao"
    user.lastName = "Duner"
    user.email = "dao.duner@domain.host"
    user.tasks = []
    
    return [user]

@pytest.fixture
def two_users():
    user1 = MagicMock()
    user1.firstName = "Dao"
    user1.lastName = "Duner"
    user1.email = "dao.duner@domain.host"

    user2 = MagicMock()
    user2.firstName = "Dao1"
    user2.lastName = "Duner1"
    user2.email = "dao.duner@domain.host"  # same email on purpose
    
    return [user1, user2]

@pytest.fixture
def invalid_email():
    return "invalid-email"

@pytest.fixture
def valid_email():
    return "dao.duner@domain.host"

# TEST CASES for get_user_by_email
# C1
@pytest.mark.unit
def test_invalid_email(user_controller, invalid_email):
  # test if ValueError rises with invalid email
  with pytest.raises(ValueError):
      user_controller.get_user_by_email(invalid_email)

# C2
@pytest.mark.unit
def test_valid_email_no_users(user_controller, mock_dao, valid_email):
  # test if None return with no users having valid email
  # Create value that returns mock_dao
  mock_dao.find.return_value = []
  result = user_controller.get_user_by_email(valid_email)
  assert result == None

# C3
@pytest.mark.unit
def test_valid_email_one_user(user_controller, mock_dao, valid_email, one_user):
  # Create value that returns mock_dao
  mock_dao.find.return_value = one_user
  # Assert result
  result = user_controller.get_user_by_email(valid_email)
  print(result)
  assert result == one_user[0]

# C4-1
@pytest.mark.unit
def test_valid_email_several_user(user_controller, mock_dao, valid_email, two_users):
  # Create value that returns mock_dao
  mock_dao.find.return_value = two_users
  # Assert result
  result = user_controller.get_user_by_email(valid_email)
  print(result)
  assert result == two_users[0]

# C4-2
@pytest.mark.unit
def test_warning_printed_when_multiple_users_found(user_controller, mock_dao, valid_email, two_users):
    mock_dao.find.return_value = two_users

    captured_output = io.StringIO()
    sys.stdout = captured_output  # Redirect stdout
    user_controller.get_user_by_email(valid_email)
    sys.stdout = sys.__stdout__  # Reset stdout
    output = captured_output.getvalue()
    assert f"more than one user found with mail {valid_email}" in output

# C5
@pytest.mark.unit
def test_database_failure_raises_exception(user_controller, mock_dao, valid_email):
  # Simulate the DAO throwing an exception
  mock_dao.find.side_effect = Exception("Database failure")
  
  # and test if the exception will be raised by the tested method 
  with pytest.raises(Exception, match="Database failure"):
    user_controller.get_user_by_email(valid_email)

#C6
@pytest.mark.unit
def test_valid_email_several_user_prints_warning(user_controller, mock_dao, valid_email, two_users):
    # Simulate the DAO returning more than one user
    mock_dao.find.return_value = two_users
    # assert if output match expected
    captured_output = io.StringIO()
    sys.stdout = captured_output  # redirect stdout
    user_controller.get_user_by_email(valid_email)
    sys.stdout = sys.__stdout__  # reset redirect
    assert "more than one user found with mail" in captured_output.getvalue()
    assert valid_email in captured_output.getvalue()
    