#import urllib.request
import re
import urllib3
import json

#https://nusmods.com/timetable/sem-1/share?CS1010=LAB:E04,TUT:08,SEC:1&CS2040C=LAB:04,LEC:1&ES1103=SEC:S13&PC1201=TUT:5,LEC:1


modules = 'https://nusmods.com/timetable/sem-1/share?CS1010=LAB:E04,TUT:08,SEC:1&CS2040C=LAB:04,LEC:1&ES1103=SEC:S13&PC1201=TUT:5,LEC:1'
modules = modules.split('?')
modules_name = modules[1].split('&')

if (modules[0].find('sem-1') != -1):
    sem = 1
elif (modules[0].find('sem-2') != -1):
    sem = 2
elif (modules[0].find('st-i') != -1):
    sem = 3
else:
    sem = 4


print(modules_name)

http = urllib3.PoolManager()
r = http.request('GET','https://api.nusmods.com/v2/2021-2022/modules/ES1103.json')
x = json.loads(r.data.decode('utf-8'))
y = x['semesterData']

for xy in y:
    if (xy['semester'] == sem):
        z = xy['timetable']
        break;


for xy in z:
    if (xy['classNo'] == 'S13'):
        print(xy['day'] + " " + xy['startTime'] + '-' + xy['endTime'])


# print(modules)

# http = urllib3.PoolManager()
# r = http.request('GET','https://api.nusmods.com/v2/2021-2022/modules/CS1010.json')
# x = json.loads(r.data.decode('utf-8'))
# y = x['semesterData'][0]['timetable']

# for xy in y:
#     if (xy['classNo'] == 'E05'):
#         print(xy['startTime'] + '-' + xy['endTime'])


# fp = urllib.request.urlopen("http://www.python.org")
# mybytes = fp.read()

# mystr = mybytes.decode("utf8")
# fp.close()

# print(mystr)
