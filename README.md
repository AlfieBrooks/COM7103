# COM7103

## Project Overview

This project is a recipe management system for a Uni module on Distributed Systems. It allows users to create, read, update, and delete recipes, which can in turn utilise RabbitMQ to queue messages to a second microservice that will call an API to generate an AI image for that recipe.

## Prerequisites

- Node 20
- Python 3
- Docker
- Supabase account and projects
- HuggingFace account

## Installation

1. Clone the repository
2. Install the dependencies

   ```sh
   pnpm install
   ```

3. Duplicate the `.env-example` in each of the services folders, rename to `.env` and add the service credentials
4. Create and active the python virtual env in the `autoscaler` folder

   ```sh
   python -m venv venv && source venv/bin/activate
   ```

5. Install the python dependencies

   ```sh
   pip install -r requirements.txt
   ```

## Running the System

1. Run the start command to start the docker compose stack and autoscaler service

   ```sh
   pnpm run start
   ```

2. The frontend will be running at `http://localhost`.
