import { ResponsiveNeoGraph } from "./NeoGraph";
import AppBarWithDrawer from '../../components/AppBarWithDrawer';
import ReturnPageList from './ReturnPageList';
import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";

function GraphPage(){

    function generateCypher(fullname){
        return `match(a1:Author{fullname:'${fullname}'})-[r:ORTAK_ÇALIŞIR]->(a2)
        match(a1)<-[r2:YAYIN_YAZARI]-(p)
        match(p)-[r3:YAYINLANIR]->(pub)
        return a1,r,a2,r2,r3,p,pub`
    }

    const [cypher, setCypher] = useState("");
    let { id } = useParams();

    useEffect(() => {
        async function fetchData(){
            if(id){
                let res = await axios.get("/get_by_id/" + id)
                setCypher(generateCypher(res.data.properties.fullname))
            }
            else{
                setCypher("MATCH (n)-[r]->(m) RETURN *")
            }
        }
        
        fetchData()
    }, [])

    const content = (
        <div>
            <h4>Graph Data</h4>
            <ResponsiveNeoGraph
            containerId={"id0"}
            neo4jUri={process.env.REACT_APP_BOLT_URI}
            neo4jUser={process.env.REACT_APP_USER}
            neo4jPassword={process.env.REACT_APP_PASSWORD}
            initial_cypher={cypher}
            setCypher = {setCypher}
            generateCypher = {generateCypher}
            />
        </div>
    )
    const page_list = ReturnPageList()

    return (
        <AppBarWithDrawer content={content} 
        appBarHeader = "User Panel"
        pageList= {page_list}
        />
    )
    
    
}

export default GraphPage