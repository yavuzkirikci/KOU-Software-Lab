import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';
import RunCommand from './DBOperations/RunCommand.js';

const __dirname = path.resolve();
//console.log(__dirname);
const parser = new xml2js.Parser();
var files = fs.readdirSync(__dirname + '/Dosyalar');
//console.log(files)


let hocalar_list = ["Abdurrahman Gün", "Ahmet Sayar", "Alev Mutlu", "A. Burak Inner",
"Burcu Kir Savas", "Fidan Kaya Gülagiz", "Fulya Akdeniz", "Furkan Göz", "Hikmetcan Ozcan",
"Mehmet Ali Altuncu", "Meltem Kurt PehlIvanoõlu", "Onur Gök","Orhan Akbulut","Pinar Onay Durdu",
"Sevinç Ilhan Omurca", "Suhap Sahin", "Yasar Becerikli", "Kerem Kucuk", "Nevcihan Duru"]

async function HandlePublication(author_info,_publication, author_id, type) {
    
    let publication_key = _publication.$['key'];
    let publication_date = _publication.$['mdate'];
    let publication_title = _publication.title[0];
    let publication_year = _publication.year[0];
    let publication_type = type
    let publication_journal = ""
    if(_publication.journal)
        publication_journal = _publication.journal[0];
    else
        publication_journal = "IEEE Access"


    let _authorList = _publication.author
    //console.dir(_authorList);
    for (let i = 0; i < _authorList.length; i++) {
        let author_id_2 = _authorList[i].$['pid'];

        let author_name_2 = _authorList[i]['_'];
        if(!hocalar_list.includes(author_name_2))
            continue;

        let sp = author_name_2.split(" ");
        let surname_2 = author_name_2.split(' ')[sp.length - 1];
        author_name_2 = author_name_2.replace(surname_2, '').trim();

        let query = 
            "MERGE (a:Author {author_id : $author_id, name : $author_name, surname : $surname, fullname: $fullname}) " +
            "MERGE (a2:Author {author_id : $author_id_2, name : $author_name_2, surname : $surname_2, fullname: $fullname_2}) " + 
            "MERGE (p:Publication {publication_id : $publication_id, title : $publication_title, year : $publication_year, type : $publication_type,date : $publication_date}) " + 
            "MERGE (pub: Publisher {name : $publisher_name}) " +
            "MERGE (p)-[:YAYIN_YAZARI]->(a) " +
            "MERGE (p)-[:YAYIN_YAZARI]->(a2) " +
            "MERGE (p)-[:YAYINLANIR]->(pub) "
        
            if (author_id_2 !== author_info.author_id) {
                query += "MERGE (a)-[:ORTAK_ÇALIŞIR]->(a2) "
                query += "MERGE (a2)-[:ORTAK_ÇALIŞIR]->(a) "
            }
            query += "RETURN p ";
        const params = {
            author_id: author_info.author_id,
            author_name: author_info.name,
            surname: author_info.surname,
            fullname: author_info.fullname,
            author_id_2: author_id_2,
            author_name_2: author_name_2,
            surname_2: surname_2,
            fullname_2: author_name_2 + " " + surname_2,
            publication_id: publication_key,
            publication_title: publication_title,
            publication_year: publication_year,
            publication_type: publication_type,
            publication_date: publication_date,
            publisher_name: publication_journal
            
        };
        const result = await RunCommand(query, params);;

    }
}


async function write_file_to_database(filepath) {
    fs.readFile(filepath, function (err, data) {
        parser.parseString(data, async function (err, result) {
            let name = result.dblpperson['$'].name;
            let sp = name.split(" ");
            let surname = name.split(' ')[sp.length - 1];
            name = name.replace(surname, '').trim();
            let author_id = result.dblpperson['$'].pid;
            
            let author_infos = {
                author_id: author_id,
                name: name,
                surname: surname,
                fullname : name + " " + surname
            }

            for (let j = 0; j < result.dblpperson.r.length; j++) {

                let _publication = result.dblpperson.r[j]

                if (!_publication.article){
                    _publication = _publication.inproceedings[0];
                    await HandlePublication(author_infos,_publication, author_id, "konferans");
                }
                else{
                    _publication = _publication.article[0]
                    await HandlePublication(author_infos,_publication, author_id, "makale");
                }

            }
        });
    });
}

async function main(){
    //await create_constraints();
    //await drop_constraints()
    let TIME_INTERVAL = 2000;
    for (let z = 0; z < files.length; z++) {
        setTimeout(() => {
            write_file_to_database(__dirname + '/Dosyalar/' + files[z])
        }, TIME_INTERVAL * z);
    } 
}

main()