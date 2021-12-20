import os
import requests


def download(url, dest_folder,file):
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)  # create folder if it does not exist

    filename = url.split('/')[-1].replace(" ", "_")  # be careful with file names
    file_path = os.path.join(dest_folder, file)

    r = requests.get(url, stream=True)
    if r.ok:
        print("saving to", os.path.abspath(file_path))
        with open(file_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024 * 8):
                if chunk:
                    f.write(chunk)
                    f.flush()
                    os.fsync(f.fileno())
    else:  # HTTP status code 4XX/5XX
        print("Download failed: status code {}\n{}".format(r.status_code, r.text))


download("http://18.222.208.214:8000/auth/users/exportcsv", dest_folder="./",file ="users_data.csv")
download("http://18.222.208.214:8000/posts/export/posts", dest_folder="./",file ="posts_data.csv")
download("http://18.222.208.214:8000/posts/export/likes", dest_folder="./",file ="like_data.csv")
download("http://18.222.208.214:8000/posts/export/foodtype", dest_folder="./",file ="foodtypes.csv")
download("http://18.222.208.214:8000/posts/export/foodtypetags", dest_folder="./",file ="foodtypetags.csv")

import deploy