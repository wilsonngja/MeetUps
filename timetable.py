import re
import urllib3
import json
import datetime

#Variable Declaration
module_list = {}
module_slot_timetable = {}
semester = {'sem-1': 1, 'sem-2' : 2, 'st-i' : 3, 'st-ii' : 4}
lesson_type = {'LEC': "Lecture", "TUT": "Tutorial", "SEC" : "Sectional Teaching", "LAB" : "Laboratory", "PTUT" : "Packaged Tutorial", "PLEC" : "Packaged Lecture"}

# Sample module link
modules = 'https://nusmods.com/timetable/sem-1/share?CG2111A=LAB:04&CS1010=TUT:06,SEC:1&CS2040C=LAB:05,LEC:1&EE2023=PLEC:01,PTUT:02'


# Splitting the entire text into 2 portion the first portion is used to identify the semester
# The second portion is where all the modules is
modules = modules.split('?')
modules_name = modules[1].split('&')


# Create a dict where the key is the module name and the value is the module slot where 
# lesson type is not separated
for x in modules_name:
    x = x.split('=')
    module_list.update({x[0]: x[1]}) 

# Split each module by their type then insert into the dict
# So after this loop, it will be something like {ModuleCode : {LessonType : LessonCode}}
for x in module_list:
    module_class = {}
    module_slot = module_list[x].split(',') 
    for y in module_slot:
        y = y.split(':')
        module_class.update({y[0]:y[1]})

    module_list.update({x: module_class})
http = urllib3.PoolManager()


for x in module_list:
    
    request_query = 'https://api.nusmods.com/v2/' + str(2021) + '-' + str(2022) + '/modules/' + x + '.json'
    r = http.request('GET',request_query)
    json_load = json.loads(r.data.decode('utf-8'))

    for i in json_load['semesterData']:
        if i['semester'] == semester[re.findall(r"\w+-\w+", modules[0])[0]]:
            for j in i['timetable']:
                for k in module_list[x]:
                    
                    if j['classNo'] == module_list[x][k] and j['lessonType'] == lesson_type[k]:
                        print(x + "         " + k + '     ' + j['day'] + "  " + j['startTime'] + '-' + j['endTime'])
                