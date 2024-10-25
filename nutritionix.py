import requests
import os

API_KEY = os.getenv('API_ID')
API_SECRET = os.getenv('API_SECRET')
APP_ID = os.getenv('APP_ID')


BASE_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients'




def food_query(query : str):
    # Construct the full URL by signing the request with query parameters (not body)

    # Send GET request with signed URL and headers
    # response = oauth.get(BASE_URL, params=params)

    response = requests.post(BASE_URL, headers={'Authorization' : f'Bearer {data["access_token"]}'}, json=params)



    print("RESPONSE URL", response.url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        if 'foods' in data and 'food' in data['foods']:
            for food in data['foods']['food']:
                print(f"Food: {food['food_name']} | ")
                print(f"\nCals & Macros: {food['food_description']}")
        else:
            print('No results found')
    else:
        print(f"JSON Error code: {response.status_code} \n{response.json()}")
        print('Error text:', response.text)

def food_search(query:str):
    headers = {
        'x-app-id':API_KEY, 
        'x-app-key':API_SECRET, 
        'x-remote-user-id': APP_ID, 
        'Content-Type':'application/json'
    }

    body = {'query':query}

    response = requests.get(BASE_URL, headers=headers, json=body)

    if response.status_code == 200:
        data = response.json()
        print(data)
        if 'foods' in data:
            for food in data['foods']:
                print(f"Food: {food['food_name']}")
                print(f"Serving Size: {food['serving_qty']} {food['serving_unit']}")
                print(f"Calories: {food['nf_calories']} kcal")
                print(f"Protein: {food['nf_protein']} g")
                print(f"Carbs: {food['nf_total_carbohydrate']} g")
                print(f"Fat: {food['nf_total_fat']} g")
                print("\n")
    else:
        print(f'Error in call. JSon status code {response.status_code}\n ERROR:{response}')



def main():
    t = input("Do you want to search up a food [y/n]?\n")
    user_wants_to_search = t=='y'
    while(user_wants_to_search):
        query = input("Enter a food to search\n")
        # food_query(query)
        food_search(query)
        user_wants_to_search = 'y'==input("Do you want to search up a food [y/n]?\n")


if __name__ == "__main__":
    main()