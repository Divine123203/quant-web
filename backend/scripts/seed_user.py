from app.db.session import SessionLocal
from app.models.core import User
from app.core.security import get_password_hash

def seed_user():
    db = SessionLocal()
    try:
        users_to_seed = [
            {"email": "admin@quantbet.ai", "name": "Admin User"},
            {"email": "divineodozie@gmail.com", "name": "Divine Odozie"}
        ]
        
        for user_data in users_to_seed:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                print(f"Creating user {user_data['email']}...")
                hashed_pwd = get_password_hash("admin123")
                user = User(
                    full_name=user_data["name"],
                    email=user_data["email"],
                    hashed_password=hashed_pwd,
                    is_superuser=True
                )
                db.add(user)
                db.commit()
                print(f"User created: {user_data['email']} / admin123")
            else:
                print(f"User {user_data['email']} already exists.")
    except Exception as e:
        print(f"Error seeding user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()
