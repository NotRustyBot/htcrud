# htcrud

HTTP CRUD server for file-based storage using Node.js built-in modules.

## Installation

```bash
npm install <git-url>
```

Or run directly with npx:

```bash
npx htcrud
```

## Usage

### CLI

```bash
htcrud --port 3000 --dir .
```

Options:
- `--port` - Port to listen on (default: 3000)
- `--dir` - Directory for file storage (default: `.`)

### Library

```javascript
import { start } from 'htcrud';

start({ port: 3000, dir: './data' });
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/<path>` | Read file |
| PUT | `/<path>` | Create/update file |
| POST | `/<path>` | Create file |
| DELETE | `/<path>` | Delete file |

## Status Codes

- 200 - OK (GET success)
- 201 - Created (PUT/POST success)
- 204 - No Content (DELETE success)
- 400 - Bad Request
- 404 - Not Found
- 500 - Internal Server Error