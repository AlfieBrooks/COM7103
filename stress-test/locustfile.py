from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def load_homepage(self):
        self.client.get("/")  # Test the homepage

    @task
    def load_recipes(self):
        self.client.get("/api/api/v1/recipes")  # Test the recipes page

    # @task
    # def load_user_recipes(self):
    #     self.client.get("/api/recipes/mine")  # Test the user recipes endpoint
