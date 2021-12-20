import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import re
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
model_knn = pickle.load(open('pickle_file', 'rb'))
ratings = pd.read_csv(r'ratings.csv' , sep='\t', index_col=0)
rating_popular_post_pivot = ratings.pivot(index = 'food_type', columns = 'user_id', values = 'like').fillna(0)


@app.route('/predict_api',methods=['GET','POST'])
def predict_api():
    '''
    For direct API calls trought request
    '''
    food = request.args.get("food")
    #distances, indices = model_knn.kneighbors(rating_popular_post_pivot.iloc[query_index,:].values.reshape(1, -1), n_neighbors = 6)
    #print("indices", indices)
    distances, indices = model_knn.kneighbors(rating_popular_post_pivot.loc[food,:].values.reshape(1, -1),n_neighbors = 6)
    #print("indices", indices)
    recommendations = []
    for i in range(0, len(distances.flatten())):
        if i == 0:
            print('Recommendations for {0}:\n'.format(food))
        else:
            recommendations.append(rating_popular_post_pivot.index[indices.flatten()[i]])
            print('{0}: {1}'.format(i, rating_popular_post_pivot.index[indices.flatten()[i]]))
    return jsonify({'prediction': recommendations})

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
