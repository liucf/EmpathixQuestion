import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamodb = new DynamoDBClient({});
const TABLE_NAME = 'Items';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { httpMethod, path, body } = event;
        const id = event.pathParameters?.id;

        switch (httpMethod) {
            case 'POST':
                return await createItem(JSON.parse(body || '{}'));
            case 'GET':
                return await getItem(id);
            case 'PUT':
                return await updateItem(id, JSON.parse(body || '{}'));
            case 'DELETE':
                return await deleteItem(id);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Unsupported HTTP method' }),
                };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

async function createItem(item: any) {
    const params = {
        TableName: TABLE_NAME,
        Item: marshall(item),
    };
    await dynamodb.send(new PutItemCommand(params));
    return {
        statusCode: 201,
        body: JSON.stringify(item),
    };
}

async function getItem(id: string | undefined) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing id parameter' }),
        };
    }
    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ id }),
    };
    const { Item } = await dynamodb.send(new GetItemCommand(params));
    if (!Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Item not found' }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(Item)),
    };
}

async function updateItem(id: string | undefined, updates: any) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing id parameter' }),
        };
    }
    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ id }),
        UpdateExpression: 'set #n = :n, #d = :d',
        ExpressionAttributeNames: {
            '#n': 'name',
            '#d': 'description',
        },
        ExpressionAttributeValues: marshall({
            ':n': updates.name,
            ':d': updates.description,
        }),
        ReturnValues: 'ALL_NEW' as const,
    };
    const { Attributes } = await dynamodb.send(new UpdateItemCommand(params));
    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(Attributes ?? {})),
    };
}

async function deleteItem(id: string | undefined) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing id parameter' }),
        };
    }
    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ id }),
    };
    await dynamodb.send(new DeleteItemCommand(params));
    return {
        statusCode: 204,
        body: '',
    };
}