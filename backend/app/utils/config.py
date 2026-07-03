# config.py
from enum import Enum
from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"

class Settings(BaseSettings):
    # 1. Automatically type-cast environment variables
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    
    # 2. Strong types: PostgresDsn ensures it's a valid database URL format
    DATABASE_URL: PostgresDsn
    
    # 3. SecretStr hides the value when printing/logging settings
    # SECRET_KEY: SecretStr
    
    # 4. Optional variable with a default value
    PORT: int = 8000
    SHORT_DOMAIN: str

    # Configuration for pydantic-settings
    model_config = SettingsConfigDict(
        # Tells Pydantic to read from a .env file if it exists
        env_file=".env",
        # If an environment variable is set, it overrides the .env file
        env_file_encoding="utf-8",
        # Case-insensitive matching (e.g., database_url matches DATABASE_URL)
        case_sensitive=False
    )

# Instantiate the settings object immediately
settings = Settings()