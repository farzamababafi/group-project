# run.py
import uvicorn

def main():
    # Use the string import path "app.main:app" for better reload support
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()