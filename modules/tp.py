import psycopg2
from psycopg2 import sql

# Replace these with your .env values or hardcoded for now
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'dbname': 'mock_interview_db',
    'user': 'mockuser',
    'password': 'user@pass'
}

def create_admin_user():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to PostgreSQL database")

        insert_query = sql.SQL("""
            INSERT INTO users (
                id, name, email, phone_number, education,
                gender, password_hash, created_at, user_type,
                branch, stream, approval_status, is_active,
                linkedin_url, resume_url
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s
            )
            ON CONFLICT (id) DO NOTHING
        """)

        admin_values = (
            1, 'admin', 'admin@ad.com', '1234567890', '12',
            'Male', '$2b$10$/PhalR4zXqHXy5uCkl2Ym.kRRryB1zFY09baxe2Zf66ml7fvCBUGi',
            '2025-06-11 19:13:05', 'admin',
            None, None, 'pending', True,
            None, None
        )

        cursor.execute(insert_query, admin_values)
        conn.commit()

        print("✅ Admin user inserted successfully (or already exists).")
    except Exception as e:
        print("❌ Error:", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    create_admin_user()
