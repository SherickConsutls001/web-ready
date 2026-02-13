from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== CATEGORIES =====
@api_router.get("/categories")
async def get_categories():
    return {
        "development_it": {
            "name": "Development & IT",
            "description": "Software development and technology services",
            "subcategories": [
                "Web Development",
                "Mobile App Development (iOS, Android)",
                "Desktop Software Development",
                "Ecommerce Development (Shopify, WooCommerce)",
                "CMS Development (WordPress, Webflow)",
                "Game Development",
                "Scripts & Automation",
                "API Development & Integration",
                "Cloud Engineering (AWS, Azure, Google Cloud)",
                "DevOps & Infrastructure",
                "Cybersecurity",
                "Blockchain & Web3",
                "QA & Testing"
            ]
        },
        "ai_services": {
            "name": "AI Services",
            "description": "Artificial intelligence and machine learning",
            "subcategories": [
                "AI Model Development",
                "Machine Learning",
                "Chatbot Development",
                "AI Integration",
                "Generative AI",
                "Prompt Engineering",
                "AI Automation"
            ]
        },
        "data_science": {
            "name": "Data Science & Analytics",
            "description": "Data analysis and business intelligence",
            "subcategories": [
                "Data Analysis",
                "Data Visualization",
                "Data Engineering",
                "Data Mining",
                "Business Intelligence",
                "SQL & Database Management",
                "Power BI",
                "Tableau"
            ]
        },
        "design_creative": {
            "name": "Design & Creative",
            "description": "Visual design and creative services",
            "subcategories": [
                "Graphic Design",
                "Logo Design",
                "UI/UX Design",
                "Web Design",
                "Product Design",
                "Video Editing",
                "Animation & Motion Graphics",
                "3D Modeling & Rendering",
                "Illustration",
                "Branding & Identity"
            ]
        },
        "writing_translation": {
            "name": "Writing & Translation",
            "description": "Content creation and language services",
            "subcategories": [
                "Content Writing",
                "Copywriting",
                "Blog Writing",
                "Technical Writing",
                "SEO Writing",
                "Translation",
                "Proofreading & Editing",
                "Resume & CV Writing"
            ]
        },
        "sales_marketing": {
            "name": "Sales & Marketing",
            "description": "Digital marketing and business growth",
            "subcategories": [
                "Digital Marketing",
                "Social Media Marketing",
                "Social Media Management",
                "Search Engine Optimization (SEO)",
                "Search Engine Marketing (Google Ads)",
                "Email Marketing",
                "Lead Generation",
                "Marketing Strategy",
                "Sales & Business Development"
            ]
        },
        "admin_support": {
            "name": "Admin & Customer Support",
            "description": "Virtual assistance and administrative services",
            "subcategories": [
                "Virtual Assistance",
                "Data Entry",
                "Customer Support",
                "Email Support",
                "Chat Support",
                "Phone Support",
                "Appointment Setting",
                "Project Management"
            ]
        },
        "finance_accounting": {
            "name": "Finance & Accounting",
            "description": "Financial management and bookkeeping",
            "subcategories": [
                "Bookkeeping",
                "Accounting",
                "Payroll",
                "Financial Analysis",
                "Tax Preparation",
                "Financial Modeling"
            ]
        },
        "hr_training": {
            "name": "HR & Training",
            "description": "Human resources and talent management",
            "subcategories": [
                "Recruiting & Talent Sourcing",
                "HR Management",
                "Training & Development",
                "Interviewing",
                "HR Consulting"
            ]
        },
        "legal": {
            "name": "Legal",
            "description": "Legal consulting and services",
            "subcategories": [
                "Contract Drafting",
                "Legal Consulting",
                "Compliance",
                "Corporate Law",
                "Intellectual Property"
            ]
        },
        "engineering_architecture": {
            "name": "Engineering & Architecture",
            "description": "Engineering design and architecture services",
            "subcategories": [
                "Civil Engineering",
                "Mechanical Engineering",
                "Electrical Engineering",
                "Structural Engineering",
                "Architecture",
                "CAD Design",
                "Interior Design"
            ]
        }
    }

# ===== PRICING =====
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
