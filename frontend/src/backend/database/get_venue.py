import re
import urllib3
import json
import pymongo
from datetime import datetime, date, time, timedelta
from pymongo import MongoClient, InsertOne


# Establish connection and connect to 'mydatabase' database
client = pymongo.MongoClient("mongodb+srv://wilsonngja:wilsonngja@cluster0.20uxruv.mongodb.net/?retryWrites=true&w=majority")
my_db = client['venue_availability_sem1']
my_col = my_db['Week 2']

my_query = {'Day': 'Friday'}

mydoc = my_col.find(my_query)

example_time = ["0930", "1400"]
for x in mydoc:
    for y in x['Availability Timeslot']:

        if ((example_time[0] >= y[0]) and (example_time[1] <= y[1])):
            print(x['Venue'] + "    " +y[0] + '-' + y[1])