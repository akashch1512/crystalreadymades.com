import uvicorn
import os

if __name__ == "__main__":
    # 1. Get the PORT from Railway's environment variables (default to 8000 locally)
    port = int(os.environ.get("PORT", 8000))
    
    # 2. Run Uvicorn directly
    # host="0.0.0.0" is MANDATORY for Railway to route traffic to your container
    uvicorn.run(
        "app.start:app", 
        host="0.0.0.0", 
        port=port, 
        reload=False,  # Disable reload for production performance
        workers=1      # Standard for simple deployments; increase if scaling manually
    )
