import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

export default function ConnectToNeo4j(){
    dotenv.config()
    return neo4j.driver(process.env.REACT_APP_BOLT_URI,
                  neo4j.auth.basic(process.env.REACT_APP_USER, process.env.REACT_APP_PASSWORD), 
                  { disableLosslessIntegers: true },
                  {/* encrypted: 'ENCRYPTION_OFF' */});
} 