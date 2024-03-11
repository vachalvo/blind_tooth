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

function modulo(n){
    return ((n % 360) + 360) % 360;
}

function calculateAngle(firstGps, secondGps){
    let dy = firstGps.latitude - secondGps.latitude;
    let dx = Math.cos(firstGps.latitude * (Math.PI / 180)) * (secondGps.longtitude - firstGps.longtitude);
    return modulo((Math.atan2(dy, dx) * (180 / Math.PI)))
}

function calculateDistance(firstGps, secondGps) {
    const R = 6371e3;
    const φ1 = firstGps.latitude * Math.PI/180; // φ, λ in radians
    const φ2 = secondGps.latitude * Math.PI/180;
    console.log("φ1 " + φ1);
    console.log("φ2 " + φ2);
    const Δφ = (secondGps.latitude-firstGps.latitude) * Math.PI/180;
    const Δλ = (secondGps.latitude-firstGps.latitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    return d;
}

const asin = Math.asin
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt
const PI = Math.PI

// equatorial mean radius of Earth (in meters)
const R = 6378137

function squared (x) { return x * x }
function toRad (x) { return x * PI / 180.0 }
function hav (x) {
    return squared(sin(x / 2))
}

function haversineDistance (a, b) {
    const aLat = toRad(Array.isArray(a) ? a[1] : a.latitude)
    const bLat = toRad(Array.isArray(b) ? b[1] : b.latitude)
    const aLng = toRad(Array.isArray(a) ? a[0] : a.longitude)
    const bLng = toRad(Array.isArray(b) ? b[0] : b.longitude)

    const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng)
    return 2 * R * asin(sqrt(ht))
}

function calculateDistance2(firstGps, secondGps) {
    return haversineDistance([firstGps.latitude, firstGps.longtitude], [secondGps.latitude, secondGps.longtitude])
}

async function getUsersLast(userId){
    if (!userId) {
        return {};
    }

    let command = new QueryCommand({
        TableName: dataTableName,
        KeyConditionExpression:
          "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
        Limit: 1,
        ScanIndexForward: false,
        ConsistentRead: true,
    });  

    let response = await dynamo.send(command);
    let data = response.Items;
    console.log("Response: " + response)

    if (!data || data.length !== 1){
        return {};
    }

    return data[0];
}

async function getDataUserId(event){
    let queryParams = event.queryStringParameters;

    if (!queryParams || !queryParams.userId){
        throw Error('Missing userId');
    }

    console.log(event.headers['logged-user-id'])
    console.log(event.headers);

    if (!event.headers['logged-user-id']){
        throw Error('There is no logged user');
    }

    let currentUser = event.headers['logged-user-id'];

    let loggedUser = await getUsersLast(currentUser);
    let targetUser = await getUsersLast(queryParams.userId);

    let loggedUserGPS = loggedUser.gps;
    let targetUserGPS = targetUser.gps;

    if (!loggedUserGPS){
        throw Error('Logged user was not found')
    }
    if(!targetUserGPS) {
        throw Error('Users was not found')
    }
    let angle = calculateAngle(loggedUserGPS, targetUserGPS);
    let distance = calculateDistance2(loggedUserGPS, targetUserGPS);

    let currentTime  = Date.now();
    if (queryParams.now){
        currentTime = queryParams.now;
    }

    let nowMinusSix = currentTime - 4000;
    let nowMinusThree = currentTime - 2000;

    let command = new QueryCommand({
        TableName: dataTableName,
        KeyConditionExpression:
          "userId = :userId AND created >= :minusSix",
        ExpressionAttributeValues: {
            ":userId": queryParams.userId,
            ":minusSix": nowMinusSix
        }
    });



    let commandCurrentUser = new QueryCommand({
        TableName: dataTableName,
        KeyConditionExpression:
          "userId = :userId AND created >= :minusSix",
        ExpressionAttributeValues: {
            ":userId": currentUser,
            ":minusSix": nowMinusSix
        }
    });


    let responseCurrentUser = await dynamo.send(commandCurrentUser);
    let response = await dynamo.send(command);
    let items = response.Items;

    if (!items || items.length === 0) {
        // return {};
    }

    let currentUserItems = responseCurrentUser.Items;
    if (!currentUserItems || currentUserItems.length === 0) {
        return {}
    }

    //Filter signal null or empty
    currentUserItems = currentUserItems.filter((item) => item.wifiSignalStrength !== null && item.wifiSignalStrength !== '' && item.wifiSignalStrength !== 'null')

    let newData = currentUserItems.filter((item) => item.created > nowMinusThree);
    let oldData = currentUserItems.filter((item) => item.created < nowMinusThree);

    let newSignalAvg = 0;

    if (newData.length !== 0){
        console.log("New data ack")
        newSignalAvg = newData.reduce((a, b) => a + b.wifiSignalStrength, 0) / newData.length;  
    } else {
        console.log("IDK")
    }

    let oldSignalAvg = 0;

    if (oldData.length !== 0){
        console.log("Old data ack")
        oldSignalAvg = oldData.reduce((a, b) => a + b.wifiSignalStrength, 0) / oldData.length;
    } else {
        console.log("IDK")
    }

    const lastItem = targetUser;
    return {newSignalAvg, oldSignalAvg, lastItem, angle, distance};  
}

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        body = await getDataUserId(event)
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
