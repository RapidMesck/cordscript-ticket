# CordScript - Ticket Viewer

CordScript is a simple web-based tool that decodes base64-encoded JSON chat data and renders it in a **Discord-style interface**. It's ideal for viewing archived support tickets, especially those exported from bots or systems that log messages in Discord-like formats.

## 🚀 Features

- 🎨 Clean and familiar Discord-like UI
- 💬 Groups messages by author and timestamp
- 📎 Displays attachments and embedded fields
- ⚙️ Client-side only: No data is stored or sent to a server
- 🧪 Includes an example ticket for demo purposes

## 🖥️ Demo

Visit the home page and click **"Try Example"** to preview a sample ticket.

## 🔧 How It Works

1. Encode your chat data (JSON array of messages) to base64.
2. Add it to the URL as a query parameter:  
   ```
   /chat?data=<your-base64-data>
   ```
3. The app will decode and render the conversation in a styled interface.

### 📄 Example JSON format

```json
[
  {
    "timestamp": "2025-04-16T17:26:31Z",
    "userType": "System",
    "author": "ticket-bot#0001",
    "content": "Ticket criado",
    "attachments": [],
    "embeds": []
  }
]
```

## 🧬 Technologies

- **Next.js 14+** (App Router)
- **React** with Client and Server Components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase/PostgreSQL** for short link redirection (optional route)

## 📁 Project Structure

```
/
├── app/
│   ├── page.tsx            # Home page (example encoder)
│   ├── chat/page.tsx       # Chat rendering page
│   └── [slug]/page.tsx     # Server route for URL redirection (optional)
├── app/layout.tsx          # Global layout + ThemeProvider
├── app/loading.tsx         # Fallback loading state
├── styles/globals.css      # Tailwind + custom styles
```

## 🔐 Optional: Short Link Redirection

This project includes a server component (`[slug]/page.tsx`) to handle short URL redirection from a PostgreSQL database. Set the `DATABASE_URL` environment variable to enable it.

`links` database schema:

```md
id: INT
slug: VARCHAR
url: TEXT
created_at: TIMESTAMP WITH TIME ZONE
```

```env
DATABASE_URL=postgres://user:pass@host:port/db
```

## 🛠️ Setup & Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📦 Build & Deploy

```bash
npm run build
npm start
```

## 📝 License

MIT — Feel free to use and adapt!
