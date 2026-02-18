from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuantBet"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    USE_SQLITE: bool = False
    
    # POSTGRES
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    POSTGRES_PORT: str = "5432"

    # REDIS
    REDIS_HOST: Optional[str] = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # SECURITY
    SECRET_KEY: str = "temporary_secret_key_for_dev_change_in_prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days for now
    
    # EXTERNAL API
    RAPIDAPI_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
