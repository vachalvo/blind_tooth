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
const dataTableName = "data";
const usersTableName = "users";

async function getUsersByName(event) {
    const queryParams = event.queryStringParameters;

    if (!queryParams){
        throw Error('Missing userId');
    }

    const command = new ScanCommand({
        TableName: 'users', // Your DynamoDB table name
        FilterExpression: 'contains(userId, :value)', // The filter expression
        ExpressionAttributeValues: { ':value': queryParams.userId  }
    });

    const response = await dynamo.send(command);
    return response.Items;
}

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        body = await getUsersByName(event)
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
