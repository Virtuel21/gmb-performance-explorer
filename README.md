# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4a808e93-6543-4fca-a9a7-5436465e5fe2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4a808e93-6543-4fca-a9a7-5436465e5fe2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4a808e93-6543-4fca-a9a7-5436465e5fe2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Google OAuth configuration

Les fonctions Edge `google-oauth` et `sync-google-data` nécessitent plusieurs variables d'environnement pour fonctionner correctement. Assurez‑vous de définir les variables suivantes dans votre projet Supabase :

```
GOOGLE_CLIENT_ID=<id client Google>
GOOGLE_CLIENT_SECRET=<secret client Google>
GOOGLE_REDIRECT_URI=<URL de rappel utilisée pour l’authentification>
```

Ces valeurs doivent correspondre à la configuration de votre application Google Cloud et à l'URL utilisée lors de la redirection dans l'interface (`/auth/google/callback`).

La fonction `sync-google-data` interroge également l'API `businessprofileperformance` pour récupérer les métriques quotidiennes des établissements (clics vers le site, appels, demandes d'itinéraire, impressions, etc.). Assurez‑vous que votre application possède le scope `https://www.googleapis.com/auth/business.manage`.
