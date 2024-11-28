# htcrud

## Overview

This is a lightweight Express.js-based file management server that provides basic Create, Read, Update, and Delete (CRUD) operations for JSON files. The server allows you to interact with files in the local filesystem through RESTful API endpoints.

## Features

- Create new files with JSON content
- Read existing files
- Update files with new content
- Delete files
- CORS support for cross-origin requests

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express body-parser cors
   ```

## Dependencies

- Express.js
- body-parser
- cors

## Usage

### Start the Server

```bash
node htcrud.js
```

The server will start on port 3000 by default. You can change the port by setting the `PORT` environment variable.

### API Endpoints

#### Create a File
- **Method**: POST
- **Endpoint**: `/:filename`
- **Body**: JSON content to be saved
- **Example**: 
  ```bash
  curl -X POST http://localhost:3000/example.json 
       -H "Content-Type: application/json" 
       -d '{"key": "value"}'
  ```

#### Read a File
- **Method**: GET
- **Endpoint**: `/:filename`
- **Example**: 
  ```bash
  curl http://localhost:3000/example.json
  ```

#### Update a File
- **Method**: PUT
- **Endpoint**: `/:filename`
- **Body**: New JSON content
- **Example**: 
  ```bash
  curl -X PUT http://localhost:3000/example.json 
       -H "Content-Type: application/json" 
       -d '{"new": "content"}'
  ```

#### Delete a File
- **Method**: DELETE
- **Endpoint**: `/:filename`
- **Example**: 
  ```bash
  curl -X DELETE http://localhost:3000/example.json
  ```

## Security Considerations

- This server writes files directly in the current directory
- Ensure proper access controls and input validation in production
- Do not expose this server directly to the internet without additional security measures

## Error Handling

- 201 Status: File successfully created
- 200 Status: File successfully read/updated/deleted
- 404 Status: File not found
- 500 Status: Server error during file operation
