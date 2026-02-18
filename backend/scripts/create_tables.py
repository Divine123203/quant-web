from app.db.session import engine
from app.models.core import Base

def create_tables():
    print("Reviewing/Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Done.")

if __name__ == "__main__":
    create_tables()
