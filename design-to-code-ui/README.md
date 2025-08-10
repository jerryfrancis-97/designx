# DesignX - AI-Powered App Generator Workspace

A Next.js + Tailwind CSS application that integrates with the Lovable API to create a powerful app generator workspace. Users can describe their app ideas and receive generated code that gets saved to their working repository/folder.

## Features

- **AI-Powered App Generation**: Describe your app idea and let AI generate the code
- **Lovable API Integration**: Seamless integration with Lovable's app generation service
- **Workspace Management**: Save, organize, and manage your generated projects
- **Code Preview & Export**: View generated code and export to your development environment
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **Project History**: Keep track of all your generated apps and projects

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Lovable API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd design-to-code-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Lovable API Configuration
   NEXT_PUBLIC_LOVABLE_API_URL=https://api.lovable.dev
   NEXT_PUBLIC_LOVABLE_API_KEY=your_lovable_api_key_here
   NEXT_PUBLIC_LOVABLE_API_TIMEOUT=60000
   ```

   **Note**: You'll need to obtain your Lovable API credentials from [Lovable](https://lovable.dev).

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### 1. App Generation

1. **Describe Your App**: In the left panel, enter a detailed description of your app idea
2. **Optional Settings**: Add an app name and specify any particular requirements
3. **Generate**: Click "Generate App" to create your application
4. **Wait**: The AI will process your description and generate the appropriate code

### 2. Workspace Management

1. **View Generated Code**: The middle panel shows your generated code with syntax highlighting
2. **Code Actions**: 
   - Copy code to clipboard
   - Save code to file
   - Open in workspace
   - Run the generated code
3. **Preview Mode**: Switch between code view and preview mode

### 3. Project History

1. **View Projects**: The right panel displays all your generated projects
2. **Project Management**: 
   - Open previous projects
   - Delete unwanted projects
   - Track project status and timestamps

## API Integration

### Lovable API

The application integrates with the Lovable API for app generation. Currently, it includes:

- **Demo Mode**: Simulated API responses for testing
- **Real API Integration**: Ready for production Lovable API integration
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: Built-in timeout and retry mechanisms

### Customizing API Integration

To integrate with the actual Lovable API:

1. Update the API endpoints in `src/lib/lovable-api.ts`
2. Configure authentication headers
3. Handle real API responses and errors
4. Implement proper rate limiting and retry logic

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── components/         # React components
│   ├── AppGenerator.tsx    # App generation form
│   ├── Header.tsx          # Application header
│   ├── Projects.tsx        # Project management
│   └── Workspace.tsx       # Code workspace
├── lib/               # Utility libraries
│   └── lovable-api.ts # Lovable API integration
└── types/             # TypeScript type definitions
```

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:

- Color schemes in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/app/globals.css`

### Components

All components are built with Radix UI primitives for accessibility and customization:

- Modify component behavior in individual component files
- Add new UI components following the existing pattern
- Customize component props and interfaces

### API Integration

Extend the Lovable API integration:

- Add new API endpoints
- Implement additional authentication methods
- Add support for different app frameworks
- Integrate with other AI services

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Deploy

The application can be deployed to:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site hosting
- **AWS/GCP**: Container-based deployment
- **Self-hosted**: Traditional server deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- `NEXT_PUBLIC_LOVABLE_API_URL`
- `NEXT_PUBLIC_LOVABLE_API_KEY`
- `NEXT_PUBLIC_LOVABLE_API_TIMEOUT`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the Lovable API documentation

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced code editing capabilities
- [ ] Integration with popular IDEs
- [ ] Team workspace management
- [ ] Advanced AI model selection
- [ ] Custom framework templates
- [ ] Deployment automation
- [ ] Analytics and insights

---

Built with ❤️ using Next.js, Tailwind CSS, and the Lovable API
