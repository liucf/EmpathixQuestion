# Empathix Serverless CRUD Application

This project implements a serverless CRUD (Create, Read, Update, Delete) application using AWS services: API Gateway, Lambda, and DynamoDB.


## Live Example

This project is set up live.

You can use this endpoint to interact with the server and retrieve or manipulate data as needed.
```
https://dyu5bn4jmg.execute-api.ap-southeast-2.amazonaws.com/stage1/items
```

- To retrieve an item: GET `/items/{id}`
  Example: `https://dyu5bn4jmg.execute-api.ap-southeast-2.amazonaws.com/stage1/items/1`

- To add a new item: POST `/items`
  Example: `https://dyu5bn4jmg.execute-api.ap-southeast-2.amazonaws.com/stage1/items`
  ```
    {
    "id": "1",
    "name": "Example Item",
    "description": "This is an example item"
    }
    ```

- To update an item: PUT `/items/{id}`
  Example: `https://dyu5bn4jmg.execute-api.ap-southeast-2.amazonaws.com/stage1/items/1`
    ```
    {
    "name": "Updated example Item",
    "description": "Updated example item"
    }
    ```
- To delete an item: DELETE `/items/{id}`
  Example: `https://dyu5bn4jmg.execute-api.ap-southeast-2.amazonaws.com/stage1/items/1`

Remember to use appropriate HTTP methods and include necessary data in the request body for POST and PUT operations.

## Setup Instructions

1. AWS CLI: Ensure you have the AWS CLI installed and configured with your AWS credentials.

2. Install dependencies:
   ```
   npm install
   ```

3. Create a DynamoDB table:
   ```
   aws dynamodb create-table --table-name Items --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

4. Create a Lambda function:
   - Navigate to the AWS Lambda console
   - Create a new function
   - Set the runtime to Node.js 14.x or later
   - Set the handler to `index.handler`

5. Deploy the code to Lambda:
   - Build the TypeScript code: `npm run build`
   - Zip the contents of the `dist` folder
   - Upload the zip file to your Lambda function

6. Set up API Gateway:
   - Create a new REST API
   - Create resources and methods for each CRUD operation:
     - POST /items
     - GET /items/{id}
     - PUT /items/{id}
     - DELETE /items/{id}
   - Connect each method to your Lambda function
   - Deploy the API

7. Update the Lambda function's IAM role to allow DynamoDB access:
   - Go to the IAM console
   - Find the role associated with your Lambda function
   - Attach the `AmazonDynamoDBFullAccess` policy (or a more restrictive custom policy)

## API Endpoints

- POST /items: Create a new item
- GET /items/{id}: Retrieve an item by ID
- PUT /items/{id}: Update an item
- DELETE /items/{id}: Delete an item

## Running the Application

After setting up the AWS services, you can use tools like cURL or Postman to interact with your API endpoints.

Example:
curl -X POST https://your-api-gateway-url/items -d '{"id": "1", "name": "Example Item", "description": "This is an example item"}'


Replace `https://your-api-gateway-url` with the actual URL of your deployed API Gateway.

## Development

To make changes to the application:

1. Modify the code in `src/index.ts`
2. Run `npm run build` to compile the TypeScript code
3. Deploy the updated code to Lambda using the AWS Console or CLI

Remember to update your API Gateway configuration if you make changes to the API structure.