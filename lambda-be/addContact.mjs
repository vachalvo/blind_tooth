import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const contactTableName = "contacts";

async function postData(event) {
    let currentUser = event.headers['logged-user-id']
    if (!currentUser) {
        throw Error('User is not logged in')
    }

    const requestBody = JSON.parse(event.body);

    const friendId = requestBody.friendId;

    if(!friendId){
        throw Error('Missing parameter friendId')
    }



    const putCommand = new PutCommand({
        TableName: contactTableName,
        Item: {
            userId: currentUser,
            friendId: friendId
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
