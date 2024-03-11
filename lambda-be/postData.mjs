import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const dataTableName = "data";

async function postData(event) {
    let currentUser = event.headers['logged-user-id']
    if (!currentUser) {
        throw Error('User is not logged in')
    }

    const currentTimestamp = Date.now();
    const ttl = currentTimestamp + 3600000;
    const requestBody = JSON.parse(event.body);

    const putCommand = new PutCommand({
        TableName: dataTableName,
        Item: {
            userId: currentUser,
            created: currentTimestamp,
            ttl: ttl,
            compass: requestBody.compass,
            gps: requestBody.gps,
            wifiSignalStrength: requestBody.wifiSignalStrength 
        },
    })

    await dynamo.send(putCommand);
}



export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        await postData(event);
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
