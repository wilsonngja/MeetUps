import re
import urllib3
import json
from datetime import datetime, date, time


#JSON query
http = urllib3.PoolManager()
request_query = 'https://api.nusmods.com/v2/2021-2022/moduleList.json'
r = http.request('GET',request_query)

#A list of all the module in the current academic year will print given in the 
#response json query
json_load = json.loads(r.data.decode('utf-8'))

#Store it as a file called modules.json
with open('modules.json', 'w', encoding='utf-8') as f:
    json.dump(json_load, f, ensure_ascii=False, indent=4)

