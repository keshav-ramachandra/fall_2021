
import requests
import json
"""
states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
"""
states = ["NY"]
#key='ad834dae1f3cb4ee1483f131118e1abc'
key='2d2b292159414ad2aa8316311c9352bb'
entries=[]


def appendRestaurantEntriesForPage(state,page):
    url = 'https://api.documenu.com/v2/restaurants/state/{0}?page={1}&key={2}'.format(state,page,key)
    resp = requests.get(url=url)
    print("state is ", state)
    if resp.ok:
        data = resp.json()
        restaurants = data['data']
        for restaurant in restaurants:
            entry = {"name":restaurant['restaurant_name'],"address":restaurant['address']['formatted'],"lat":restaurant['geo']['lat'], "long":restaurant['geo']['lon'],"phone":restaurant['restaurant_phone'],"website":restaurant['restaurant_website']}
            entries.append(entry)

with open('restaurants.json', mode='w', encoding='utf-8') as f:
    for i in range(len(states)):
        url = 'https://api.documenu.com/v2/restaurants/state/{0}?key={1}'.format(states[i],key)
        resp = requests.get(url=url)
        data = resp.json()
        pages = data['total_pages']
        if(pages > 2):
            pages = 2
        for page in range(0,pages):
            appendRestaurantEntriesForPage(states[i],page+1)

    json.dump(entries,f)



