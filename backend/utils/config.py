import os
from pathlib import Path
from dotenv import load_dotenv

# Load local .env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Database configuration
# Railway variables are preferred when available.
DB_HOST = os.getenv("MYSQLHOST") or os.getenv("DB_HOST") or "localhost"
DB_PORT = os.getenv("MYSQLPORT") or os.getenv("DB_PORT") or "3306"
DB_USER = os.getenv("MYSQLUSER") or os.getenv("DB_USER") or "root"
DB_PASSWORD = os.getenv("MYSQLPASSWORD") or os.getenv("DB_PASSWORD") or "NewStrongPassword123!"
DB_NAME = os.getenv("MYSQLDATABASE") or os.getenv("DB_NAME") or "turfbooking_hub"

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

# JWT configuration
JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "super_secret_jwt_key_for_turfbooking_hub_2026_coimbatore"
)

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
)