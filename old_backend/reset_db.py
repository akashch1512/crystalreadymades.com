import os
from dotenv import load_dotenv
from app.database.tables import engine, Base

load_dotenv()

# Drop all tables
Base.metadata.drop_all(bind=engine)
print("✅ All tables dropped")

# Recreate tables
Base.metadata.create_all(bind=engine)
print("✅ All tables recreated")
