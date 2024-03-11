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

async function getSpecificUserByName(userId) {
    const command = new QueryCommand({
        TableName: usersTableName,
        KeyConditionExpression:
          "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        },
        ConsistentRead: true,
    });

    const response = await dynamo.send(command);
    if (!response.Items || response.Items.length === 0) {
        throw Error("User does not exists");
    }

    return response.Items[0];
}

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        const userId = event.queryStringParameters.userId;
        body = await getSpecificUserByName(userId)
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
