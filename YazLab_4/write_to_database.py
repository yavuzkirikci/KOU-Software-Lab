import pandas as pd   
import pymongo
import sqlite3

# write last 30 minutes to no-sql database
client = pymongo.MongoClient("mongodb+srv://admin:admin@cluster0.suejd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
print(client.list_database_names())
db = client["app"]

data = pd.read_csv("data.csv")
data2 = data.time.str[14:16].astype(int)
data3 = data.iloc[data2[data2 > 30].index]
data4 = data3[data3.time.str.startswith("2018-11-30 16:")] 
for index, row in data4.iterrows():
    db.taxi_infos.insert_one({
        "date" : row["time"][:11],
        "hour" : row["time"][11:],
        "lat" : row["lat"], 
        "lng" : row["lng"],
        "taxi_id" : str(row["id"])
    })

# write datas to sql database
conn = sqlite3.connect("local.db")
c = conn.cursor()

data = pd.read_csv("data.csv")
data2 = data.time.str[14:16].astype(int)
data3 = data.iloc[data2[data2 > 30].index]
data4 = data3[data3.time.str.startswith("2018-11-30 16:")]
not_in = list(data4.index)
indexes = list(range(0, data.shape[0]))
indexes = [e for e in indexes if e not in not_in]
data5 = data.iloc[indexes] 

c.execute("""CREATE TABLE IF NOT EXISTS taxi_info (date text,hour text, lat text, lng text, id integer )""")

for index, row in data.iterrows():
    date = row["time"][:11]
    hour = row["time"][11:]
    c.execute("""INSERT INTO taxi_info(date, hour, lat, lng, id) VALUES (?,?,?,?,?);""", [
        date,
        hour,
        row["lat"], 
        row["lng"], 
        row["id"],
    ])

conn.commit()


