# Quick Admin Setup Guide

## ⚠️ First: Enable Email/Password Authentication

**Before anything else, enable Email/Password auth:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **stylesync-sistc**
3. Go to **Authentication** → **Sign-in method**
4. Click **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

---

## Fastest Way to Create an Admin Account

### Step 1: Sign Up
1. Go to your app's login page
2. Click "Sign up" and create an account
3. Note your email address

### Step 2: Make User Admin
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **stylesync-sistc**
3. Go to **Firestore Database**
4. Click on **users** collection
5. Find the document with your email (the document ID is your User UID)
6. Click on the document
7. Change the `role` field value from `user` to `admin`
8. Click **Update**

### Step 3: Verify
1. Log out and log back in
2. You should see an "Admin" link in the navbar
3. Click it to access the Admin Dashboard

---

## Deploy Security Rules

Run this command to deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

Or manually:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy contents from `firestore.rules` file
3. Paste and click "Publish"

---

## That's It! 🎉

You now have admin access. You can:
- Add, edit, and delete products
- View all users
- Manage the store

For more details, see [ADMIN_SETUP.md](./ADMIN_SETUP.md)

