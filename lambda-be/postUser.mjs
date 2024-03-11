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


async function postNewUser(event) {
    const requestBody = JSON.parse(event.body);

    const putCommand = new PutCommand({
        TableName: usersTableName,
        Item: requestBody
    })

    await dynamo.send(putCommand)
}

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
    if (response.Items && response.Items.length > 0) {
        throw Error("User already exists");
    }
}

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        const requestBody = JSON.parse(event.body);
        body = await getSpecificUserByName(requestBody.userId);
        await postNewUser(event)
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
