import pymysql
import pymysql.cursors



sql='CREATE TABLE `users` (`id` int(11) NOT NULL AUTO_INCREMENT,`email` varchar(255) NOT NULL,`password` varchar(255) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;'
sql1='SELECT other_name FROM ch_medicine WHERE name="%s"'%"人参"

def mysql(sql):
    conn = pymysql.connect(host='localhost',port=3306, user='root', password='123456', db='cm_data', charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)
    a = conn.cursor()
    try:
        a.execute(sql)
        results =a.fetchall()
        return results
        #print(results)
        # name1=a.fetchone().get('name')
        #print(name1)

    except:
        print("Error: unable to fecth data")

    a.close()
    conn.close()
#mysql(sql1)







