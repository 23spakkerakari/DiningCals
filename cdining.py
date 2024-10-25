from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
import os

class CornellDiningAPI:
    def __init__(self, nutritionix_api_key, nutritionix_app_id):
        self.base_url =  "https://now.dining.cornell.edu/dining_locations"
        self.headers = {
            "x-app-key":nutritionix_api_key, 
            "x-app-id": nutritionix_app_id, 
            "Content-Type": "application/json"
        }
        self.nutritionix_url = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    def get_dining_locations(self):
        '''Get's all available dining locations'''
        try:
            response = requests.get(self.base_url)
            bsoup = BeautifulSoup(response.text, 'html.parser')
            
        except Exception as e:
            print(f"There was an error in retrieving info: {e}")


if __name__ == "__main__":
    api_key = os.getenv
