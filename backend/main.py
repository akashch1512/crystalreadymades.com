import uvicorn
import os

if __name__ == "__main__":
    # Railway provides the port via an environment variable
    port = int(os.environ.get("PORT", 8000))
    
    # host="0.0.0.0" is required for the service to be reachable externally
    uvicorn.run(
        "app.start:app", 
        host="0.0.0.0", 
        port=port, 
        reload=False  # Always disable reload in production
    )
