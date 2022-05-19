import re
import urllib3
import json
from datetime import datetime, date, time



#Variable Declaration
module_list = {}
module_slot_timetable = []
semester = {'sem-1': 1, 'sem-2' : 2, 'st-i' : 3, 'st-ii' : 4}
lesson_type = {'LEC': "Lecture", "TUT": "Tutorial", "SEC" : "Sectional Teaching", "LAB" : "Laboratory", "PTUT" : "Packaged Tutorial", "PLEC" : "Packaged Lecture"}
lesson_slot = {"Monday": [(time(8), time(8))], "Tuesday" : [(time(8), time(8))], "Wednesday" : [(time(8), time(8))], "Thursday" : [(time(8), time(8))], "Friday": [(time(8), time(8))]}


print("Input number of people")
num_of_people = input()

for x in range(int(num_of_people)):
    print("Input module link:")
    modules = input()


    # Splitting the entire text into 2 portion the first portion is used to identify the semester
    # The second portion is where all the modules is
    modules = modules.split('?')
    modules_name = modules[1].split('&')


    # Create a dict where the key is the module name and the value is the module slot where 
    # lesson type is not separated
    for x in modules_name:
        x = x.split('=')
        module_list.update({x[0]: {}}) 
        module_slot_timetable = x[1].split(',')

        # Split each module by their type then insert into the dict
        # So after this loop, it will be something like {ModuleCode : {LessonType : LessonCode}}
        module_class = {}

        for x2 in module_slot_timetable:
            x2 = x2.split(":")
            
            module_class.update({x2[0]:x2[1]})

        # print(module_class)
        module_list.update({x[0]: module_class})







    http = urllib3.PoolManager()
    
# This part is generating the NUSMods API.
# From the API, we gather module info and based on the timetable and class, we assign the timeslot
    for x in module_list:
        # print(module_list[x])
        request_query = 'https://api.nusmods.com/v2/' + str(2021) + '-' + str(2022) + '/modules/' + x + '.json'
        r = http.request('GET',request_query)
        json_load = json.loads(r.data.decode('utf-8'))

        for i in json_load['semesterData']:
            if i['semester'] == semester[re.findall(r"\w+-\w+", modules[0])[0]]:
                for j in i['timetable']:
                    for k in module_list[x]:
                        
                        if j['classNo'] == module_list[x][k] and j['lessonType'] == lesson_type[k]:
                            lesson_slot[j['day']].append((time(int(j['startTime'][0] + j['startTime'][1]), int(j['startTime'][2] + j['startTime'][3])), time(int(j['endTime'][0] + j['endTime'][1]), int(j['endTime'][2] + j['endTime'][3]))))
                        
    module_list = {}
# print(lesson_slot)
    
print("Available Timeslot:")
for x in lesson_slot:
    lesson_slot[x].append((time(23,59), time(23,59)))
    lesson_slot[x] = sorted(lesson_slot[x])
    # print(x)
    # print(lesson_slot[x])
    for start_time, end_time in ((lesson_slot[x][i][1], lesson_slot[x][i + 1][0]) for i in range(len(lesson_slot[x]) - 1)):
        if end_time > start_time:
            print(x + "     " + str(start_time) + "-" + str(end_time))






                