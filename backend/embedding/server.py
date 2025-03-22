import grpc
import signal
import sys
from concurrent import futures
import numpy as np
from sentence_transformers import SentenceTransformer
from sentence_transformers.quantization import quantize_embeddings
import time
import logging
import os
from dotenv import load_dotenv

# Import the generated gRPC code
import embedding_pb2
import embedding_pb2_grpc

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the env variables
load_dotenv()
MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/static-retrieval-mrl-en-v1")
GRPC_PORT = os.getenv("EMBEDDING_PORT", "")
MAX_WORKERS = int(os.getenv("EMBEDDING_MAX_WORKERS", "10"))
GRACEFUL_SHUTDOWN_TIMEOUT = int(os.getenv("EMBEDDING_GRACEFUL_SHUTDOWN_TIMEOUT", "30"))

# Define model cache directory as a relative path
# This will create the cache in the current working directory of the container (most likely going to be /app)
MODEL_CACHE_DIR = os.path.join(os.getcwd(), "model_cache")

class EmbeddingServiceServicer(embedding_pb2_grpc.EmbeddingServiceServicer):
    def __init__(self):
        # Load the model at startup
        logger.info(f"Loading model from cache directory: {MODEL_CACHE_DIR}")
        try:
            # Create cache directory if it doesn't exist
            os.makedirs(MODEL_CACHE_DIR, exist_ok=True)
            
            # Load model with explicit cache directory
            self.model = SentenceTransformer(
                MODEL_NAME, 
                device="cpu",
                cache_folder=MODEL_CACHE_DIR
            )
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise

    def GenerateEmbeddings(self, request, context):
        try:
            # Extract texts from request
            texts = list(request.texts)
            
            # Generate embeddings
            logger.info(f"Generating embeddings for {len(texts)} texts")
            embeddings = self.model.encode(texts)
            
            # Quantize embeddings to binary
            embeddings = quantize_embeddings(embeddings, precision='ubinary')
            
            # Create response
            response = embedding_pb2.EmbeddingResponse()
            
            # Convert numpy arrays to bytes and add to response
            for embedding in embeddings:
                response.embeddings.append(embedding.tobytes())
            
            return response
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error generating embeddings: {str(e)}")
            return embedding_pb2.EmbeddingResponse()

    def HealthCheck(self, request, context):
        return embedding_pb2.HealthCheckResponse(status="healthy")

def download_model_if_needed():
    """Pre-download the model to ensure it's available offline"""
    try:
        logger.info(f"Pre-downloading model {MODEL_NAME} to {MODEL_CACHE_DIR}")
        # This will download the model if it's not already cached
        temp_model = SentenceTransformer(MODEL_NAME, cache_folder=MODEL_CACHE_DIR)
        logger.info("Model pre-downloaded successfully")
    except Exception as e:
        logger.error(f"Failed to pre-download model: {str(e)}")
        raise

def serve():
    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))
    
    # Add the servicer to the server
    embedding_pb2_grpc.add_EmbeddingServiceServicer_to_server(
        EmbeddingServiceServicer(), server
    )
    
    # Listen on all interfaces (important for Docker)
    server.add_insecure_port(f'[::]{GRPC_PORT}')
    server.start()
    
    logger.info(f"Server started, listening on port {GRPC_PORT}")

    # Setup signal handlers for graceful shutdown
    def graceful_shutdown(signum, frame):
        logger.info(f"Received signal {signum}, initiating graceful shutdown...")
        # Stop accepting new requests but allow existing ones to complete
        logger.info("Stopping server gracefully...")
        server.stop(GRACEFUL_SHUTDOWN_TIMEOUT)  # Give 30 seconds for in-flight requests to complete
        logger.info("Server stopped gracefully")
        sys.exit(0)

    # connect the signals to the graceful shutdown function
    signal.signal(signal.SIGTERM, graceful_shutdown)
    signal.signal(signal.SIGINT, graceful_shutdown)

    server.wait_for_termination()

if __name__ == '__main__':
    # Ensure model is downloaded before starting server
    download_model_if_needed()
    serve()
