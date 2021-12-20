# -*- coding: utf-8 -*-
"""
Created on Tue May 19 12:58:39 2020

@author: HP PC
"""
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

rd_data=pd.read_csv("C:\\Users\\HP PC\\Downloads\\AB_NYC_2019.csv")

# total null valves
rd_data.isnull().sum()

#mean imputation for missing values in reviews per month section
rd_data['reviews_per_month'].fillna(rd_data['reviews_per_month'].mean(), inplace=True)

#converting character values to numerical
for i in range(0,len(rd_data)):
    if rd_data['room_type'][i]=='Private room':
        rd_data['room_type'][i]=1
    elif rd_data['room_type'][i]=='Entire home/apt':
        rd_data['room_type'][i]=2
    else:
        rd_data['room_type'][i]=3      

for i in range(0,len(rd_data)):
    if rd_data['neighbourhood_group'][i]=='Brooklyn':
        rd_data['neighbourhood_group'][i]=1
    else:
        rd_data['neighbourhood_group'][i]=2         
        
#droppping columns which have no impact on prediction such as name,id ,host id
housing_data=rd_data.drop(columns=['id','name','host_id','host_name','last_review','latitude','longitude','reviews_per_month','neighbourhood'])
housing_data=housing_data.dropna()


import seaborn as sns
f, ax = plt.subplots(figsize=(10, 8))
corr = housing_data.corr()
sns.heatmap(corr, annot=True, annot_kws={"size": 9}, cmap = sns.color_palette("PuOr_r", 50), 
                     vmin = -1, vmax = 1)


#creating dumy variables for Neighbourhood_group and Neighbourhood
#housing_data=pd.get_dummies(housing_data,columns=['neighbourhood_group'])
#housing_data=pd.get_dummies(housing_data,columns=['neighbourhood'])
#housing_data=pd.get_dummies(housing_data,columns=['room_type'])
housing_data.head()

housing_data.dtypes
housing_data=housing_data.apply(pd.to_numeric)

from sklearn.model_selection import train_test_split
y=housing_data['price']
x=housing_data.drop('price',axis=1)
X = x.apply(pd.to_numeric, errors='coerce')
Y = y.apply(pd.to_numeric, errors='coerce')
xTrain, xTest, yTrain, yTest = train_test_split(X, Y, test_size = 0.3, random_state = 42)

from sklearn.linear_model import LinearRegression as lm

regressor=lm().fit(xTrain,yTrain)
predictions=regressor.predict(xTest)

from sklearn.metrics import mean_squared_error, r2_score
print("Mean squared error: %.2f"% mean_squared_error(predictions,yTest))
print("R-square: %.2f" % r2_score(yTest,predictions))



#Using Ridge
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV

ridge=Ridge()
parameters={'alpha':[1e-15,1e-10,1e-8,1e-3,1e-2,1,5,10,20,30,35,40,45,50,55,100]}
ridge_regressor=GridSearchCV(ridge,parameters,scoring='neg_mean_squared_error',cv=5)
ridge_regressor.fit(xTrain,yTrain)
predictions_ridge=ridge_regressor.predict(xTest)

print("Mean squared error: %.2f"% mean_squared_error(predictions_ridge,yTest))
print("R-square: %.2f" % r2_score(yTest,predictions_ridge))


#Using Lasso
from sklearn.linear_model import Lasso
from sklearn.model_selection import GridSearchCV
lasso=Lasso()
parameters={'alpha':[1e-15,1e-10,1e-8,1e-3,1e-2,1,5,10,20,30,35,40,45,50,55,100]}
lasso_regressor=GridSearchCV(lasso,parameters,scoring='neg_mean_squared_error',cv=5)
lasso_regressor.fit(xTrain,yTrain)
predictions_lasso=ridge_regressor.predict(xTest)

print("Mean squared error: %.2f"% mean_squared_error(predictions_lasso,yTest))
print("R-square: %.2f" % r2_score(yTest,predictions_lasso))


import pickle
# Saving model to disk
pickle.dump(lasso_regressor, open('model.pkl','wb'))

# Loading model to compare the results
model = pickle.load(open('model.pkl','rb'))
model.score(xTest,yTest)
print(model.predict([[2,9,6,4,5,6]]))

"""

import pandas as pd
import numpy as np
import re
import pickle 
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors


food_posts = pd.read_csv(r'./food_posts.csv',sep='\t',index_col=0)
users_data = pd.read_csv(r'./users_data.csv', sep='\t',index_col=0)
like_data = pd.read_csv(r'./like_data.csv', sep='\t',index_col=0)

merge_df = pd.merge(like_data, food_posts ,on='post_id')

combine_post_rating = merge_df.dropna(axis = 0, subset = ['food_type'])

post_ratingCount = (combine_post_rating.
     groupby(by = ['food_type'])['like'].
     count().
     reset_index().
     rename(columns = {'like': 'totalLikes'})
     [['food_type', 'totalLikes']]
    )


rating_with_totalValuableCount = combine_post_rating.merge(post_ratingCount, left_on = 'food_type', right_on = 'food_type', how = 'left')

popularity_threshold = 13
rating_popular_post = rating_with_totalValuableCount.query('totalLikes >= @popularity_threshold')


rating_popular_post = rating_popular_post.drop_duplicates(['user_id', 'food_type'])
rating_popular_post_pivot = rating_popular_post.pivot(index = 'food_type', columns = 'user_id', values = 'like').fillna(0)
rating_popular_post_matrix = csr_matrix(rating_popular_post_pivot.values)


model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(rating_popular_post_matrix)
knnPickle = open('pickle_file', 'wb') 
# source, destination 
pickle.dump(model_knn, knnPickle)   