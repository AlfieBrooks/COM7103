# Use the official Python image as a base
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Locust requirements file into the container
COPY requirements.txt .

# Install required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Locust test script into the container
COPY locustfile.py .

# Expose the Locust web interface and load test ports
EXPOSE 8089

# Command to start Locust with the specified locustfile
CMD ["locust", "-f", "locustfile.py", "--host", "http://nginx"]
