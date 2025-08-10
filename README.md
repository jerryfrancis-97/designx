# DesignX App Generator Workspace

A full-stack application generator workspace that uses AI to create applications based on natural language descriptions.

## Architecture

This project uses a **separation of concerns** approach:

- **Python Backend** (`lovable-backend/`) - Handles Lovable API integration and app generation logic
- **Next.js Frontend** (`design-to-code-ui/`) - Provides the user interface and displays generated apps
- **REST API Communication** - Frontend and backend communicate via HTTP endpoints

## Features

- 🤖 **AI-Powered App Generation** - Describe your app idea in natural language
- 🐍 **Python Backend** - Robust backend with FastAPI, automatic fallback to mock generation
- ⚛️ **Modern Frontend** - Next.js 14 with TypeScript and Tailwind CSS
- 🔄 **Real-time Communication** - REST API between frontend and backend
- 💾 **Local Storage** - Persist generated apps locally
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Quick Start

### Option 1: Use the Startup Script (Windows)
```bash
# Double-click the start-system.bat file
# This will start both backend and frontend automatically
```

### Option 2: Manual Startup

#### 1. Start Python Backend
```bash
cd lovable-backend
pip install -r requirements.txt
python main.py
```
Backend will be available at: http://localhost:8000

#### 2. Start Next.js Frontend
```bash
cd design-to-code-ui
npm install
npm run dev
```
Frontend will be available at: http://localhost:3000

## Project Structure

```
designx/
├── lovable-backend/              # Python FastAPI backend
│   ├── main.py                  # Main FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── env.example             # Backend environment variables
│   └── README.md               # Backend documentation
├── design-to-code-ui/           # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js app router
│   │   ├── components/         # React components
│   │   ├── lib/                # API services
│   │   └── types/              # TypeScript type definitions
│   ├── package.json            # Node.js dependencies
│   └── env.example             # Frontend environment variables
├── start-system.bat            # Windows startup script
└── README.md                   # This file
```

## API Endpoints

### Backend (Python FastAPI)
- `GET /health` - Health check
- `POST /generate-app` - Generate new app
- `GET /apps` - List all generated apps
- `GET /apps/{id}` - Get specific app
- `DELETE /apps/{id}` - Delete app

### Frontend (Next.js)
- `/` - Main app generator interface
- `/api/*` - API routes (if needed)

## Environment Variables

### Backend (.env)
```env
LOVABLE_API_URL=https://api.lovable.dev
LOVABLE_API_KEY=your_api_key_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

### Frontend (env.example)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=App Generator Workspace
```

## How It Works

1. **User Input** - User describes their app idea in the frontend
2. **API Request** - Frontend sends request to Python backend
3. **Lovable Integration** - Backend calls Lovable API (or uses mock fallback)
4. **App Generation** - Backend processes the response and generates app data
5. **Response** - Generated app is sent back to frontend
6. **Display** - Frontend shows the generated app with code, preview, and info

## Development

### Backend Development
- FastAPI with automatic OpenAPI documentation
- Visit http://localhost:8000/docs for interactive API docs
- Automatic reload on code changes
- Comprehensive error handling and logging

### Frontend Development
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Hot reload for development

## Troubleshooting

### Backend Issues
- Check if Python dependencies are installed: `pip install -r requirements.txt`
- Verify environment variables are set correctly
- Check console for error messages

### Frontend Issues
- Ensure backend is running on port 8000
- Check browser console for API errors
- Verify environment variables are set

### Port Conflicts
- Backend uses port 8000 by default
- Frontend uses port 3000 by default
- Change ports in respective configuration files if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation at http://localhost:8000/docs
3. Check console logs for error details
4. Create an issue in the repository