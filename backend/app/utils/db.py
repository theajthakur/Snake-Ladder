from .config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL=str(settings.DATABASE_URL)

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set."
    )

connect_args = {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal=sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()