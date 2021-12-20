import pandas as pd
import numpy as np
import re
import pickle

food_posts = pd.read_csv(r'./posts_data.csv',sep=',')
users_data = pd.read_csv(r'./users_data.csv', sep=',')
like_data = pd.read_csv(r'./like_data.csv', sep=',')
food_types = pd.read_csv(r'./foodtypes.csv', sep=',')
food_type_tags = pd.read_csv(r'./foodtypetags.csv', sep=',')



merge_df = pd.merge(food_posts, food_type_tags ,on='post_id')

merge_df = merge_df.rename(columns={'foodtype_id': 'food_type_id'})
merge_df1 = pd.merge(merge_df, food_types ,on='food_type_id')
food_posts = merge_df1[['post_id', 'food_type']]

like_data.loc[(like_data['like'] == 1) & (like_data['like'] == 2)]
like_data['like'] = like_data['like'].replace([2],0)

merge_df = pd.merge(like_data, food_posts ,on='post_id')

combine_post_rating = merge_df.dropna(axis = 0, subset = ['food_type'])

post_ratingCount = (combine_post_rating.
     groupby(by = ['food_type'])['like'].
     count().
     reset_index().
     rename(columns = {'like': 'totalLikes'})
     [['food_type', 'totalLikes']]
    )
post_ratingCount.head()

rating_with_totalValuableCount = combine_post_rating.merge(post_ratingCount, left_on = 'food_type', right_on = 'food_type', how = 'left')
rating_with_totalValuableCount.tail()


pd.set_option('display.float_format', lambda x: '%.3f' % x)

popularity_threshold = 4
rating_popular_post = rating_with_totalValuableCount.query('totalLikes >= @popularity_threshold')
from scipy.sparse import csr_matrix
rating_popular_post = rating_popular_post.drop_duplicates(['user_id', 'food_type'])

rating_popular_post.to_csv('ratings.csv', sep='\t', encoding='utf-8')

rating_popular_post_pivot = rating_popular_post.pivot(index = 'food_type', columns = 'user_id', values = 'like').fillna(0)

rating_popular_post_matrix = csr_matrix(rating_popular_post_pivot.values)

from sklearn.neighbors import NearestNeighbors

model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(rating_popular_post_matrix)
knnPickle = open('pickle_file', 'wb') 
# source, destination 
pickle.dump(model_knn, knnPickle)   

"""
query_index = np.random.choice(rating_popular_post_pivot.shape[0])
print(query_index)
distances, indices = model_knn.kneighbors(rating_popular_post_pivot.iloc[query_index,:].values.reshape(1, -1), n_neighbors = 6)
print("indices", indices)

rating_popular_post_pivot.index[query_index]

for i in range(0, len(distances.flatten())):
    print(indices.flatten()[i])
    if i == 0:
        print('Recommendations for {0}:\n'.format(rating_popular_post_pivot.index[query_index]))
    else:
        print('{0}: {1}'.format(i, rating_popular_post_pivot.index[indices.flatten()[i]]))

"""




