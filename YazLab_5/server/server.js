import express, { query } from 'express';
const app = express()
const port = 8000
import RunCommand from './DBOperations/RunCommand.js';
import bodyParser from 'body-parser';

app.set('port', process.env.PORT || port);

// parse application/json
app.use(bodyParser.json())

app.get('/get_by_id/:id', async (req, res) => {
    const readQuery = `MATCH (n) WHERE ID(n) = $id RETURN n`
    console.log("ID", req.params.id)
    const readResult = await RunCommand( readQuery , { id: Number(req.params.id) })
    let person = null
    readResult.records.forEach(record => {
        person = record.get('n')
    })
    res.status(200).json(person)
})

app.get('/get_author', async (req, res) => {
    const readQuery = `MATCH (n:Author) WHERE n.fullname = $name RETURN n`
    console.log("NAME", req.query.name)
    const readResult = await RunCommand( readQuery , { name: req.query.name })
    let person = null
    readResult.records.forEach(record => {
        person = record.get('n')
    })
    res.status(200).json(person)
})

app.get('/search', async (req, res) => {
    let query_key = {}
    for (let key in req.query) {
        if (req.query[key] !== "") {
            query_key[key] = req.query[key]
        }
    }
    let publications = []
    let query = ""

    if(req.query.writerName == "" && req.query.publishmentName == "" && req.query.publishmentYear == ""){
        return res.status(200).json(publications)
    }
    
    if(req.query.writerName){
        query += `MATCH (n:Publication)-[r:YAYIN_YAZARI]->(a:Author)
        WHERE a.fullname = $writerName
        ` 
    }
    else{
        query += `MATCH (n:Publication) `
    }
    if(req.query.publishmentName != ""){
        if(req.query.writerName != ""){
            query += `AND `
        }
        else{
            query += `WHERE `
        }
        query += `n.title STARTS WITH $publishmentName `
    }
    if(req.query.publishmentYear != ""){
        console.log(req.query)
        if(req.query.writerName != "" || req.query.publishmentName != ""){
            query += `AND `
        }
        else{
            query += `WHERE `
        }
        query += `n.year = $publishmentYear `
    }
    query += `RETURN n`
    console.log(query)
    const readResult = await RunCommand( query , query_key )
    if(readResult){
        readResult.records.forEach(record => {
            publications.push(record.get('n'))
        })
    }
    
    res.status(200).json(publications)
})


app.post('/add_publication', async (req, res) => {
    const { author_id, author_name, author_surname, name, year, publisher, type } = req.body

    
    let publication_id = publisher + "/" + year + "/" + author_surname

    // create new publishment and connect to author and publisher
    let addPublishmentQuery = `MERGE (p:Publisher {name : $publisher_name})`
    if(author_id != ""){
        addPublishmentQuery += `MERGE (a:Author{author_id : $author_id})`
    }
    else{
        addPublishmentQuery += `MERGE (a:Author{name: $author_name, surname:$author_surname})`
    } 
    addPublishmentQuery += `
            MERGE (n:Publication {publication_id : $publication_id,title: $name, year: $year, type: $type})
            MERGE (n)-[:YAYINLANIR]->(p)
            MERGE (n)-[:YAYIN_YAZARI]->(a) 
            RETURN n
    `                  
                                
    const addPublishmentResult = await RunCommand( addPublishmentQuery , { name: name, year: year, type: type, publisher_name : publisher, 
        author_id: author_id, author_name : author_name, author_surname : author_surname, publication_id : publication_id,
        fullname : author_name + " " + author_surname })
    const publishment = addPublishmentResult.records[0].get('n')
    console.log("KAYIT EKLENDI")
    res.status(200).json(publishment)
})

app.post('/delete_publishment/:id', async (req, res) => {
    const deleteQuery = `MATCH (n) WHERE ID(n) = $id DETACH DELETE n`
    const deleteResult = await RunCommand( deleteQuery , { id: Number(req.params.id) })
    res.status(200).json(deleteResult)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})