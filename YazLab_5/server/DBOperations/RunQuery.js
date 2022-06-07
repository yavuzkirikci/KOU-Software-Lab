import neo4j from 'neo4j-driver';
import ConnectToNeo4j from './ConnectToNeo4j.js';

export default async function ReadConnection(readQuery, params) {
    const driver = ConnectToNeo4j()
    const session = driver.session()
    let readResult = null;
    try {

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery, params)
        )

    } catch (error) {
        console.error('Something went wrong: ', error)
    } finally {
        await session.close()
    }

    await driver.close()
    return readResult
}