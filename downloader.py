import requests
import os

from PIL import Image

headers = {
    'Cookie':
    'x-auth=69e3a3f65f1d104e2f28f77f6dce139ffba6df91f74659aa871d4e7904b38e9b; cf_clearance=4MBb6TZo25q2NiR.m6g_hGpSlruyH1o6jyUhKtU3MTk-1695142515-0-1-3d7ff5e5.5914852b.6a7eaa05-0.2.1695142515',
    'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 OPR/102.0.0.0'
}


def get_path(path):
	return "avatars/" + path.replace("?", "？")


response = requests.request(
    "GET",
    url="https://api.ripper.store/api/v2/user/purchases",
    headers=headers)

if response.status_code != 200:
	print(response.status_code)
	print(response.text)
	exit()
else:
	purchases = response.json()["data"]

with open("history.txt", "r") as historyfile:
	history = historyfile.read()
with open("history.txt", "a") as historyfile:
	for purchase in purchases:
		if purchase["ident"] in history:
			print("Skipping: " + purchase["ident"])
		else:
			response = requests.request(
			    "GET",
			    url="https://api.ripper.store/api/v2/avatars/detail?ident=" +
			    purchase["ident"],
			    headers=headers)
			if response.status_code != 200:
				print(response.status_code)
				print(response.text)
				exit()
			else:
				avatar = response.json()
				print("Downloading: " + avatar["name"] + " by " +
				      avatar["authorName"])
			for platform in avatar["platforms"]:
				avatar_path = get_path("avatar-" + avatar["name"] + " by " +
				                       avatar["authorName"] + "-" + platform +
				                       ".vrca")
				if not os.path.isfile(avatar_path):
					with requests.request(
					    "GET",
					    url="https://api.ripper.store/api/v2/download/avatar/"
					    + purchase["ident"] + "/" + platform,
					    headers=headers,
					    stream=True) as r:
						r.raise_for_status()
						with open(avatar_path, 'wb') as f:
							for chunk in r.iter_content(chunk_size=8192):
								f.write(chunk)
			image_path = get_path("avatar-" + avatar["name"] + " by " +
			                      avatar["authorName"] + ".png")
			if not os.path.isfile(image_path):
				image_downloadpath = get_path("avatar-" + avatar["name"] +
				                              " by " + avatar["authorName"] +
				                              ".webp")
				if not os.path.isfile(image_downloadpath):
					with requests.request("GET",
					                      url=avatar["image"],
					                      headers=headers,
					                      stream=True) as r:
						r.raise_for_status()
						with open(image_downloadpath, 'wb') as f:
							for chunk in r.iter_content(chunk_size=8192):
								f.write(chunk)
				im = Image.open(image_downloadpath).convert("RGB")
				im.save(image_path, "png")
				os.remove(image_downloadpath)
			historyfile.write(purchase["ident"] + "\n")