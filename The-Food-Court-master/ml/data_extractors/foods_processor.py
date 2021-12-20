import requests
import json

"""
url = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
resp = requests.get(url=url)
data = resp.json()
meals = data['meals']
for meal in meals:
    print("food name is ", meal['strMeal'], " and url is ", meal['strMealThumb'])
"""


foods = []

with open('meals_array.json', mode='w', encoding='utf-8') as f:
    for i in range(97,123):
        url = 'https://www.themealdb.com/api/json/v1/1/search.php?f={0}'.format(chr(i))
        print(url)
        resp = requests.get(url=url)
        data = resp.json()
        meals = data['meals']
        if meals:
            for meal in meals:
                entry = {'name': meal['strMeal'].strip(), 'url': meal['strMealThumb'].strip()}
                foods.append(entry)
    json.dump(foods,f)    


# get food image based on it's key

"""
foods = {}

with open('meals.json', mode='w', encoding='utf-8') as f:
    for i in range(97,123):
        url = 'https://www.themealdb.com/api/json/v1/1/search.php?f={0}'.format(chr(i))
        print(url)
        resp = requests.get(url=url)
        data = resp.json()
        meals = data['meals']
        if meals:
            for meal in meals:
                foods[meal['strMeal'].strip()] = meal['strMealThumb'].strip()
    json.dump(foods,f)  

"""