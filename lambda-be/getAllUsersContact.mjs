import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "contacts";

async function getLoggedUsersContacts(event) {
    let currentUser = event.headers['logged-user-id']
    if (!currentUser) {
        throw Error('User is not logged in')
    }

    const scanContactsCommand = new ScanCommand({
        TableName: tableName,
        FilterExpression: 'userId = :userId', // The filter expression
        ExpressionAttributeValues: { ':userId': currentUser  }
    })

    const response = await dynamo.send(scanContactsCommand);
    const items = response.Items;

    //return only contacts (not logged user)
    return items.map((contact) => contact.friendId);
}



export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        body = await getLoggedUsersContacts(event);
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
