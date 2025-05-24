import os
import subprocess
import pytest

@pytest.hookimpl(tryfirst=True)
def pytest_sessionfinish(session, exitstatus):
    """Hook to open the coverage report after tests finish."""
    report_path = os.path.join(os.getcwd(), 'cov_html', 'index.html')
    if os.path.exists(report_path):
        subprocess.run(['start', report_path], shell=True, check=True)
