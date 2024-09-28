from flask import Flask, request, jsonify
import docker
import os

app = Flask(__name__)

# Initialize Docker client
client = docker.from_env()


@app.route("/scale", methods=["POST"])
def scale_service():
    # Example endpoint to scale a service based on Prometheus alerts
    data = request.json
    service_name = data.get("service")
    replicas = data.get("replicas")

    if not service_name or not replicas:
        return jsonify({"error": "Missing service name or replicas"}), 400

    try:
        # Find the Docker service by name and update the replicas
        service = client.services.get(service_name)
        service.scale(replicas=int(replicas))
        return jsonify({"status": f"Scaled {service_name} to {replicas} replicas"}), 200
    except docker.errors.NotFound:
        return jsonify({"error": f"Service {service_name} not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Autoscaler is running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
