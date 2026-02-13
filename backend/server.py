from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
from message_filter import contains_blocked_content, filter_message, is_suspicious_message

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

# ===== MODELS =====

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: Literal["client", "worker"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    user_type: Literal["client", "worker"]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class WorkerProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    bio: str
    skills: List[str]
    hourly_rate: float
    experience_years: int
    location: str
    category: Literal["handy_work", "development_it", "ai_services", "data_science", "design_creative", "writing_translation", "sales_marketing", "admin_support", "finance_accounting", "hr_training", "legal", "engineering_architecture"]
    portfolio_links: List[str] = []
    avatar_url: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WorkerProfileCreate(BaseModel):
    title: str
    bio: str
    skills: List[str]
    hourly_rate: float
    experience_years: int
    location: str
    category: Literal["handy_work", "development_it", "ai_services", "data_science", "design_creative", "writing_translation", "sales_marketing", "admin_support", "finance_accounting", "hr_training", "legal", "engineering_architecture"]
    portfolio_links: List[str] = []
    avatar_url: Optional[str] = None

class ClientProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_name: str
    industry: str
    company_size: Optional[str] = None
    location: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    subscription_plan: Literal["free", "professional", "enterprise"] = "free"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClientProfileCreate(BaseModel):
    company_name: str
    industry: str
    company_size: Optional[str] = None
    location: str
    website: Optional[str] = None
    logo_url: Optional[str] = None

class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    title: str
    description: str
    category: Literal["handy_work", "development_it", "ai_services", "data_science", "design_creative", "writing_translation", "sales_marketing", "admin_support", "finance_accounting", "hr_training", "legal", "engineering_architecture"]
    subcategory: str
    budget_type: Literal["hourly", "fixed"]
    budget_amount: float
    location: str
    job_type: Literal["remote", "onsite", "hybrid"]
    skills_required: List[str]
    featured: bool = False
    status: Literal["open", "in_progress", "completed", "closed"] = "open"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobCreate(BaseModel):
    title: str
    description: str
    category: Literal["handy_work", "development_it", "ai_services", "data_science", "design_creative", "writing_translation", "sales_marketing", "admin_support", "finance_accounting", "hr_training", "legal", "engineering_architecture"]
    subcategory: str
    budget_type: Literal["hourly", "fixed"]
    budget_amount: float
    location: str
    job_type: Literal["remote", "onsite", "hybrid"]
    skills_required: List[str]

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    worker_id: str
    cover_letter: str
    proposed_rate: float
    status: Literal["pending", "accepted", "rejected"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: str
    proposed_rate: float

# ===== UTILITY FUNCTIONS =====

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(user_id: str, email: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===== AUTH ROUTES =====

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        user_type=user_data.user_type
    )
    
    user_doc = user.model_dump()
    user_doc["password_hash"] = hash_password(user_data.password)
    user_doc["created_at"] = user_doc["created_at"].isoformat()
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user.id, user.email)
    return Token(access_token=token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user["created_at"], str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    
    user_obj = User(**{k: v for k, v in user.items() if k != "password_hash"})
    token = create_token(user_obj.id, user_obj.email)
    return Token(access_token=token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    if isinstance(current_user["created_at"], str):
        current_user["created_at"] = datetime.fromisoformat(current_user["created_at"])
    return User(**{k: v for k, v in current_user.items() if k != "password_hash"})

# ===== WORKER PROFILE ROUTES =====

@api_router.post("/workers/profile", response_model=WorkerProfile)
async def create_worker_profile(profile_data: WorkerProfileCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "worker":
        raise HTTPException(status_code=403, detail="Only workers can create worker profiles")
    
    existing = await db.worker_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    profile = WorkerProfile(user_id=current_user["id"], **profile_data.model_dump())
    profile_doc = profile.model_dump()
    profile_doc["created_at"] = profile_doc["created_at"].isoformat()
    
    await db.worker_profiles.insert_one(profile_doc)
    return profile

@api_router.get("/workers/profile", response_model=WorkerProfile)
async def get_my_worker_profile(current_user: dict = Depends(get_current_user)):
    profile = await db.worker_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if isinstance(profile["created_at"], str):
        profile["created_at"] = datetime.fromisoformat(profile["created_at"])
    return WorkerProfile(**profile)

@api_router.put("/workers/profile", response_model=WorkerProfile)
async def update_worker_profile(profile_data: WorkerProfileCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "worker":
        raise HTTPException(status_code=403, detail="Only workers can update worker profiles")
    
    profile = await db.worker_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile_data.model_dump()
    await db.worker_profiles.update_one({"user_id": current_user["id"]}, {"$set": update_data})
    
    updated_profile = await db.worker_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if isinstance(updated_profile["created_at"], str):
        updated_profile["created_at"] = datetime.fromisoformat(updated_profile["created_at"])
    return WorkerProfile(**updated_profile)

@api_router.get("/workers", response_model=List[WorkerProfile])
async def get_workers(category: Optional[str] = None, skills: Optional[str] = None, location: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        query["skills"] = {"$in": skill_list}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    workers = await db.worker_profiles.find(query, {"_id": 0}).to_list(100)
    
    # Filter out workers with invalid categories and convert datetime
    valid_workers = []
    valid_categories = {"handy_work", "development_it", "ai_services", "data_science", "design_creative", 
                       "writing_translation", "sales_marketing", "admin_support", "finance_accounting", 
                       "hr_training", "legal", "engineering_architecture"}
    
    for worker in workers:
        if isinstance(worker.get("created_at"), str):
            worker["created_at"] = datetime.fromisoformat(worker["created_at"])
        
        # Skip workers with old/invalid categories
        if worker.get("category") not in valid_categories:
            continue
            
        valid_workers.append(WorkerProfile(**worker))
    
    return valid_workers

@api_router.get("/workers/{worker_id}", response_model=WorkerProfile)
async def get_worker_by_id(worker_id: str):
    worker = await db.worker_profiles.find_one({"id": worker_id}, {"_id": 0})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    if isinstance(worker["created_at"], str):
        worker["created_at"] = datetime.fromisoformat(worker["created_at"])
    return WorkerProfile(**worker)

# ===== CLIENT PROFILE ROUTES =====

@api_router.post("/clients/profile", response_model=ClientProfile)
async def create_client_profile(profile_data: ClientProfileCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can create client profiles")
    
    existing = await db.client_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    profile = ClientProfile(user_id=current_user["id"], **profile_data.model_dump())
    profile_doc = profile.model_dump()
    profile_doc["created_at"] = profile_doc["created_at"].isoformat()
    
    await db.client_profiles.insert_one(profile_doc)
    return profile

@api_router.get("/clients/profile", response_model=ClientProfile)
async def get_my_client_profile(current_user: dict = Depends(get_current_user)):
    profile = await db.client_profiles.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if isinstance(profile["created_at"], str):
        profile["created_at"] = datetime.fromisoformat(profile["created_at"])
    return ClientProfile(**profile)

# ===== JOB ROUTES =====

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can post jobs")
    
    job = Job(client_id=current_user["id"], **job_data.model_dump())
    job_doc = job.model_dump()
    job_doc["created_at"] = job_doc["created_at"].isoformat()
    
    await db.jobs.insert_one(job_doc)
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    category: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    budget_type: Optional[str] = None
):
    query = {"status": "open"}
    if category:
        query["category"] = category
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if job_type:
        query["job_type"] = job_type
    if budget_type:
        query["budget_type"] = budget_type
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Filter out jobs with invalid categories and convert datetime
    valid_jobs = []
    valid_categories = {"handy_work", "development_it", "ai_services", "data_science", "design_creative", 
                       "writing_translation", "sales_marketing", "admin_support", "finance_accounting", 
                       "hr_training", "legal", "engineering_architecture"}
    
    for job in jobs:
        if isinstance(job.get("created_at"), str):
            job["created_at"] = datetime.fromisoformat(job["created_at"])
        
        # Skip jobs with old/invalid categories
        if job.get("category") not in valid_categories:
            continue
            
        valid_jobs.append(Job(**job))
    
    return valid_jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job_by_id(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if isinstance(job["created_at"], str):
        job["created_at"] = datetime.fromisoformat(job["created_at"])
    return Job(**job)

@api_router.get("/jobs/client/my-jobs", response_model=List[Job])
async def get_my_jobs(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can view their jobs")
    
    jobs = await db.jobs.find({"client_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for job in jobs:
        if isinstance(job["created_at"], str):
            job["created_at"] = datetime.fromisoformat(job["created_at"])
    return [Job(**j) for j in jobs]

# ===== APPLICATION ROUTES =====

@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "worker":
        raise HTTPException(status_code=403, detail="Only workers can apply to jobs")
    
    existing = await db.applications.find_one({"job_id": app_data.job_id, "worker_id": current_user["id"]}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    application = Application(worker_id=current_user["id"], **app_data.model_dump())
    app_doc = application.model_dump()
    app_doc["created_at"] = app_doc["created_at"].isoformat()
    
    await db.applications.insert_one(app_doc)
    return application

@api_router.get("/applications/my-applications", response_model=List[Application])
async def get_my_applications(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "worker":
        raise HTTPException(status_code=403, detail="Only workers can view their applications")
    
    applications = await db.applications.find({"worker_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for app in applications:
        if isinstance(app["created_at"], str):
            app["created_at"] = datetime.fromisoformat(app["created_at"])
    return [Application(**a) for a in applications]

@api_router.get("/applications/job/{job_id}", response_model=List[Application])
async def get_job_applications(job_id: str, current_user: dict = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if current_user["user_type"] != "client" or job["client_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    applications = await db.applications.find({"job_id": job_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for app in applications:
        if isinstance(app["created_at"], str):
            app["created_at"] = datetime.fromisoformat(app["created_at"])
    return [Application(**a) for a in applications]

# ===== PRICING / SUBSCRIPTION =====

@api_router.get("/pricing/plans")
async def get_pricing_plans():
    return {
        "plans": [
            {
                "name": "Free",
                "price": 0,
                "features": ["Post up to 3 jobs per month", "Basic support", "Standard job visibility"],
                "job_limit": 3
            },
            {
                "name": "Professional",
                "price": 299,
                "currency": "ZAR",
                "features": ["Unlimited job posts", "Featured job listings", "Priority support", "Access to talent database"],
                "job_limit": -1
            },
            {
                "name": "Enterprise",
                "price": 999,
                "currency": "ZAR",
                "features": ["Everything in Professional", "Dedicated account manager", "Custom integrations", "Advanced analytics"],
                "job_limit": -1
            }
        ],
        "commission": {
            "transaction_fee": "8-20%",
            "placement_fee": "10-20% of first year salary"
        }
    }

# ===== CATEGORIES =====

@api_router.get("/categories")
async def get_categories():
    return {
        "handy_work": {
            "name": "Handy Work",
            "description": "Local services for your everyday needs",
            "subcategories": ["Plumber", "Electrician", "Cleaner", "Mover", "Handyman", "Gardener", "Painter", "Carpenter"]
        },
        "development_it": {
            "name": "Development & IT",
            "description": "Software development and technology services",
            "subcategories": [
                "Web Development", "Mobile App Development", "Desktop Software Development",
                "Ecommerce Development", "CMS Development", "Game Development",
                "Scripts & Automation", "API Development", "Cloud Engineering",
                "DevOps & Infrastructure", "Cybersecurity", "Blockchain & Web3", "QA & Testing"
            ]
        },
        "ai_services": {
            "name": "AI Services",
            "description": "Artificial intelligence and machine learning",
            "subcategories": [
                "AI Model Development", "Machine Learning", "Chatbot Development",
                "AI Integration", "Generative AI", "Prompt Engineering", "AI Automation"
            ]
        },
        "data_science": {
            "name": "Data Science & Analytics",
            "description": "Data analysis and business intelligence",
            "subcategories": [
                "Data Analysis", "Data Visualization", "Data Engineering",
                "Data Mining", "Business Intelligence", "SQL & Database Management",
                "Power BI", "Tableau"
            ]
        },
        "design_creative": {
            "name": "Design & Creative",
            "description": "Visual design and creative services",
            "subcategories": [
                "Graphic Design", "Logo Design", "UI/UX Design", "Web Design",
                "Product Design", "Video Editing", "Animation & Motion Graphics",
                "3D Modeling & Rendering", "Illustration", "Branding & Identity"
            ]
        },
        "writing_translation": {
            "name": "Writing & Translation",
            "description": "Content creation and language services",
            "subcategories": [
                "Content Writing", "Copywriting", "Blog Writing", "Technical Writing",
                "SEO Writing", "Translation", "Proofreading & Editing", "Resume & CV Writing"
            ]
        },
        "sales_marketing": {
            "name": "Sales & Marketing",
            "description": "Digital marketing and business growth",
            "subcategories": [
                "Digital Marketing", "Social Media Marketing", "Social Media Management",
                "SEO", "Google Ads", "Email Marketing", "Lead Generation",
                "Marketing Strategy", "Sales & Business Development"
            ]
        },
        "admin_support": {
            "name": "Admin & Customer Support",
            "description": "Virtual assistance and administrative services",
            "subcategories": [
                "Virtual Assistance", "Data Entry", "Customer Support",
                "Email Support", "Chat Support", "Phone Support",
                "Appointment Setting", "Project Management"
            ]
        },
        "finance_accounting": {
            "name": "Finance & Accounting",
            "description": "Financial management and bookkeeping",
            "subcategories": [
                "Bookkeeping", "Accounting", "Payroll", "Financial Analysis",
                "Tax Preparation", "Financial Modeling"
            ]
        },
        "hr_training": {
            "name": "HR & Training",
            "description": "Human resources and talent management",
            "subcategories": [
                "Recruiting & Talent Sourcing", "HR Management", "Training & Development",
                "Interviewing", "HR Consulting"
            ]
        },
        "legal": {
            "name": "Legal",
            "description": "Legal consulting and services",
            "subcategories": [
                "Contract Drafting", "Legal Consulting", "Compliance",
                "Corporate Law", "Intellectual Property"
            ]
        },
        "engineering_architecture": {
            "name": "Engineering & Architecture",
            "description": "Engineering design and architecture services",
            "subcategories": [
                "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
                "Structural Engineering", "Architecture", "CAD Design", "Interior Design"
            ]
        }
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()