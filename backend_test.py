import requests
import sys
import json
from datetime import datetime

class SkillBridgeAPITester:
    def __init__(self, base_url="https://zaworkplace.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.worker_token = None
        self.client_token = None
        self.worker_user = None
        self.client_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication...")
        
        # Test worker registration
        worker_data = {
            "email": f"worker_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Worker",
            "user_type": "worker"
        }
        
        success, response = self.run_test(
            "Worker Registration",
            "POST",
            "auth/register",
            200,
            data=worker_data
        )
        
        if success and 'access_token' in response:
            self.worker_token = response['access_token']
            self.worker_user = response['user']
        
        # Test client registration
        client_data = {
            "email": f"client_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Client",
            "user_type": "client"
        }
        
        success, response = self.run_test(
            "Client Registration",
            "POST",
            "auth/register",
            200,
            data=client_data
        )
        
        if success and 'access_token' in response:
            self.client_token = response['access_token']
            self.client_user = response['user']

        # Test login with worker
        login_data = {
            "email": worker_data["email"],
            "password": worker_data["password"]
        }
        
        self.run_test(
            "Worker Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )

        # Test /auth/me endpoint
        if self.worker_token:
            self.run_test(
                "Get Current User",
                "GET",
                "auth/me",
                200,
                headers={'Authorization': f'Bearer {self.worker_token}'}
            )

    def test_worker_profile_endpoints(self):
        """Test worker profile endpoints"""
        print("\n👷 Testing Worker Profile...")
        
        if not self.worker_token:
            print("❌ Skipping worker profile tests - no worker token")
            return

        # Create worker profile with new categories
        profile_data = {
            "title": "Senior Software Developer",
            "bio": "Experienced full-stack developer with 5+ years experience",
            "skills": ["React", "Node.js", "Python", "MongoDB"],
            "hourly_rate": 450.0,
            "experience_years": 5,
            "location": "Cape Town, South Africa",
            "category": "development_it",
            "portfolio_links": ["https://github.com/testuser", "https://portfolio.test.com"]
        }
        
        success, response = self.run_test(
            "Create Worker Profile",
            "POST",
            "workers/profile",
            200,
            data=profile_data,
            headers={'Authorization': f'Bearer {self.worker_token}'}
        )
        
        # Get worker profile
        self.run_test(
            "Get My Worker Profile",
            "GET",
            "workers/profile",
            200,
            headers={'Authorization': f'Bearer {self.worker_token}'}
        )
        
        # Update worker profile
        updated_profile = profile_data.copy()
        updated_profile["hourly_rate"] = 500.0
        
        self.run_test(
            "Update Worker Profile",
            "PUT",
            "workers/profile",
            200,
            data=updated_profile,
            headers={'Authorization': f'Bearer {self.worker_token}'}
        )
        
        # Get all workers (public endpoint)
        self.run_test(
            "Get All Workers",
            "GET",
            "workers",
            200
        )
        
        # Get workers with filters - test new categories
        self.run_test(
            "Get Workers by Development & IT Category",
            "GET",
            "workers?category=development_it",
            200
        )
        
        self.run_test(
            "Get Workers by AI Services Category",
            "GET",
            "workers?category=ai_services",
            200
        )

    def test_client_profile_endpoints(self):
        """Test client profile endpoints"""
        print("\n🏢 Testing Client Profile...")
        
        if not self.client_token:
            print("❌ Skipping client profile tests - no client token")
            return

        # Create client profile
        profile_data = {
            "company_name": "Test Tech Solutions",
            "industry": "Technology",
            "company_size": "10-50 employees",
            "location": "Johannesburg, South Africa",
            "website": "https://testtech.co.za"
        }
        
        success, response = self.run_test(
            "Create Client Profile",
            "POST",
            "clients/profile",
            200,
            data=profile_data,
            headers={'Authorization': f'Bearer {self.client_token}'}
        )
        
        # Get client profile
        self.run_test(
            "Get My Client Profile",
            "GET",
            "clients/profile",
            200,
            headers={'Authorization': f'Bearer {self.client_token}'}
        )

    def test_job_endpoints(self):
        """Test job endpoints"""
        print("\n💼 Testing Jobs...")
        
        if not self.client_token:
            print("❌ Skipping job tests - no client token")
            return

        # Create job with new categories
        job_data = {
            "title": "Full Stack Developer Needed",
            "description": "We need an experienced full-stack developer to build a modern web application using React and Node.js.",
            "category": "development_it",
            "subcategory": "Web Development",
            "budget_type": "hourly",
            "budget_amount": 400.0,
            "location": "Remote",
            "job_type": "remote",
            "skills_required": ["React", "Node.js", "MongoDB", "TypeScript"]
        }
        
        success, response = self.run_test(
            "Create Job",
            "POST",
            "jobs",
            200,
            data=job_data,
            headers={'Authorization': f'Bearer {self.client_token}'}
        )
        
        job_id = None
        if success and 'id' in response:
            job_id = response['id']
        
        # Get all jobs (public endpoint)
        self.run_test(
            "Get All Jobs",
            "GET",
            "jobs",
            200
        )
        
        # Get jobs with filters - test new categories
        self.run_test(
            "Get Jobs by Development & IT Category",
            "GET",
            "jobs?category=development_it",
            200
        )
        
        self.run_test(
            "Get Jobs by AI Services Category",
            "GET",
            "jobs?category=ai_services",
            200
        )
        
        # Get my jobs (client only)
        self.run_test(
            "Get My Jobs",
            "GET",
            "jobs/client/my-jobs",
            200,
            headers={'Authorization': f'Bearer {self.client_token}'}
        )
        
        # Get specific job
        if job_id:
            self.run_test(
                "Get Job by ID",
                "GET",
                f"jobs/{job_id}",
                200
            )
        
        return job_id

    def test_application_endpoints(self, job_id):
        """Test application endpoints"""
        print("\n📝 Testing Applications...")
        
        if not self.worker_token or not job_id:
            print("❌ Skipping application tests - missing worker token or job ID")
            return

        # Create application
        app_data = {
            "job_id": job_id,
            "cover_letter": "I am very interested in this position. I have 5+ years of experience with React and Node.js and would love to contribute to your project.",
            "proposed_rate": 420.0
        }
        
        success, response = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=app_data,
            headers={'Authorization': f'Bearer {self.worker_token}'}
        )
        
        # Get my applications (worker only)
        self.run_test(
            "Get My Applications",
            "GET",
            "applications/my-applications",
            200,
            headers={'Authorization': f'Bearer {self.worker_token}'}
        )
        
        # Get job applications (client only)
        self.run_test(
            "Get Job Applications",
            "GET",
            f"applications/job/{job_id}",
            200,
            headers={'Authorization': f'Bearer {self.client_token}'}
        )

    def test_static_endpoints(self):
        """Test static/utility endpoints"""
        print("\n📊 Testing Static Endpoints...")
        
        # Test pricing plans
        self.run_test(
            "Get Pricing Plans",
            "GET",
            "pricing/plans",
            200
        )
        
        # Test categories
        self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting SkillBridge API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Test authentication first
        self.test_auth_endpoints()
        
        # Test profiles
        self.test_worker_profile_endpoints()
        self.test_client_profile_endpoints()
        
        # Test jobs and applications
        job_id = self.test_job_endpoints()
        if job_id:
            self.test_application_endpoints(job_id)
        
        # Test static endpoints
        self.test_static_endpoints()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SkillBridgeAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0,
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())