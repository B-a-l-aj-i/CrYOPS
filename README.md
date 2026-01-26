# CrYOPS

**Create Your Own Portfolio Site** - A powerful Next.js application that helps you build and
deploy a professional portfolio website by integrating your data from multiple platforms.

## 🚀 Features

- **Multi-Platform Integration**: Connect your GitHub, LeetCode, and other coding platforms
- **AI-Powered Generation**: Automatically generate portfolio content based on your data
- **Real-time Preview**: See your portfolio update as you customize it
- **One-Click Deployment**: Deploy directly to GitHub and Vercel
- **Modern UI/UX**: Built with Tailwind CSS and shadcn/ui components
- **TypeScript Support**: Fully typed for better development experience

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Authentication**: NextAuth.js v5
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd cryops
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Fill in your environment variables
   ```

4. Run the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

AUTH_SECRET=your-nextauth-secret
```

## 📁 Project Structure

```text
cryops/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/                  # Utility libraries
├── hooks/                # React hooks
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🎯 How It Works

1. **Connect Your Data**: Add your GitHub username, LeetCode profile, and other platform links
2. **Customize Your Profile**: Add personal information, about section, and social links
3. **Choose Your Style**: Select from different portfolio templates and themes
4. **Generate & Preview**: AI generates your portfolio content in real-time
5. **Deploy**: One-click deployment to GitHub repositories and Vercel hosting

## 🚀 Deployment

### Manual Deployment

1. Build the application:

   ```bash
   pnpm build
   ```

2. Start the production server:

   ```bash
   pnpm start
   ```

### Vercel Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - your feedback and
  contributions are welcome!
- [Vercel Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) -
  more details on deployment options
