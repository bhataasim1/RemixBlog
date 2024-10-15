# Remix Blog App

A simple and user-friendly platform where anyone can create, edit, update, or delete their posts, and view content shared by others.

## Demo



https://github.com/user-attachments/assets/835461ba-06c5-463d-8b2c-b4a09c6d4f7a


## Features

- List Posts: Browse all posts easily with a responsive design, using Mantine components for a smooth experience. Posts are fetched via the Directus API.

- View Post: Dive into individual posts, complete with featured images and a clean, stylish format.

- Create Post: Share your thoughts using a sleek form built with Mantine, and submit your post to Directus. Instant feedback lets you know when your post is live!

- Edit Post: Modify your existing posts with pre-filled forms, and get confirmation when your updates are successfully saved.

- Delete Post: Quickly remove posts with a simple delete action.

- Authentication:

  - Login Page: Securely log in via the Directus authentication system.
  - Registration: New users can sign up seamlessly, and all registered users are assigned a role with the right permissions for managing their blog posts.

- UI & UX: I used Mantine UI, and the interface is responsive, intuitive, and consistent across the entire app. Expect well-designed forms, buttons, Rich text Editor, and more!

## Tech Stack

- Remix Run
- Directus
- Mantine Ui
- Tailwind CSS

## Installation

1. Clone the repository:

```bash
git clone
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy the `.env.example` file to `.env` and fill in the required environment variables.

4. Start the development server:

```bash
pnpm run dev
```
