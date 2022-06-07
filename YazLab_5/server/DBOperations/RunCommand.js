import neo4j from 'neo4j-driver';
import ConnectToNeo4j from './ConnectToNeo4j.js';
export default async function RunCommand(writeQuery, params) {

    const driver = ConnectToNeo4j()
    const session = driver.session()
    let writeResult = null;

    try {

        // Write transactions allow the driver to handle retries and transient errors
        writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, params)
        )
        
       
    } catch (error) {
        console.error('Something went wrong: ', error)
    } finally {
        await session.close()
    }

    await driver.close()
    return writeResult
}