import subprocess
import logging
from flask import Flask, jsonify, request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


@app.route("/scale", methods=["POST"])
def scale_service():
    data = request.json
    logger.info(f"Received request: {data}")

    # Extract service name and replicas from commonAnnotations
    common_annotations = data.get("commonAnnotations", {})
    service_name = common_annotations.get("service")
    replicas = common_annotations.get("replicas")
    logger.info(f"Scaling service: {service_name} to {replicas} replicas")

    if not service_name or not replicas:
        logger.error("Missing service name or replicas")
        return jsonify({"error": "Missing service name or replicas"}), 400

    try:
        # Scale the service using Docker Compose
        result = subprocess.run(
            ["docker-compose", "up", "-d", "--scale", f"{service_name}={replicas}"],
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            logger.error(f"Error scaling service: {result.stderr}")
            return jsonify({"error": result.stderr}), 500

        logger.info(f"Scaled {service_name} to {replicas} replicas")
        return jsonify({"status": f"Scaled {service_name} to {replicas} replicas"}), 200
    except Exception as e:
        logger.error(f"Error scaling service: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Autoscaler is running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
