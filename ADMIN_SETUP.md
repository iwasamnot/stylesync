# Admin Account Setup Guide

This guide explains how to set up admin accounts for the StyleSync application.

## ⚠️ Prerequisites

**Before creating accounts, make sure Email/Password authentication is enabled:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **stylesync-sistc**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

**If you skip this step, you'll get `auth/operation-not-allowed` errors!**

---

## Method 1: Using Firebase Console (Recommended)

### Step 1: Create a User Account
1. Go to your deployed app or run it locally
2. Navigate to the Login page
3. Click "Sign up" and create a new account with your email and password
4. Complete the registration process

### Step 2: Get the User UID
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **stylesync-sistc**
3. Navigate to **Authentication** → **Users**
4. Find the user you just created
5. Copy the **User UID** (it's a long string like `abc123def456...`)

### Step 3: Create/Update User Document in Firestore
1. In Firebase Console, go to **Firestore Database**
2. Navigate to the `users` collection
3. Check if a document with the User UID exists:
   - **If it exists**: Click on the document
   - **If it doesn't exist**: Click "Add document" and use the User UID as the document ID

4. Update the document with these fields:
   ```json
   {
     "email": "admin@example.com",
     "displayName": "Admin User",
     "role": "admin",
     "createdAt": "2025-01-27T00:00:00.000Z"
   }
   ```
   - Make sure `role` is set to `"admin"` (not `"user"`)

5. Click **Save**

### Step 4: Verify Admin Access
1. Log out of your account (if logged in)
2. Log back in with the admin account
3. You should now see an "Admin" link in the navigation bar
4. Navigate to `/admin` to access the Admin Dashboard

---

## Method 2: Using Firebase CLI

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged in to Firebase (`firebase login`)

### Steps
1. Create the user account through the app (as in Method 1, Step 1)
2. Get the User UID from Firebase Console
3. Run this command in your terminal:

```bash
firebase firestore:set users/USER_UID '{"email":"admin@example.com","displayName":"Admin User","role":"admin","createdAt":"2025-01-27T00:00:00.000Z"}'
```

Replace `USER_UID` with the actual User UID you copied.

---

## Method 3: Programmatically (For Development)

You can also create an admin account programmatically. Add this code temporarily to your app:

```javascript
// Temporary admin creation script
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

async function createAdmin(email, password, displayName) {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document with admin role
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    
    console.log('Admin account created successfully!');
    return user;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

// Call it once
createAdmin('admin@stylesync.com', 'securePassword123', 'Admin User');
```

**⚠️ Important**: Remove this code after creating the admin account for security reasons.

---

## Firestore Security Rules

The Firestore security rules are configured in `firestore.rules`. Key points:

- **Users**: Can read their own data, admins can read/write all user data
- **Products**: Everyone can read, only admins can create/update/delete
- **Orders**: Users can read their own orders, admins can read/write all orders

### Deploying Security Rules

To deploy the security rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

Or use the Firebase Console:
1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents of `firestore.rules`
3. Paste into the rules editor
4. Click **Publish**

---

## Troubleshooting

### Admin link not showing
- Make sure you're logged in
- Check that the `role` field in Firestore is exactly `"admin"` (lowercase, in quotes)
- Try logging out and logging back in
- Clear browser cache and refresh

### Cannot access Admin Dashboard
- Verify the user document exists in Firestore `users` collection
- Check that `role` is set to `"admin"`
- Ensure you're logged in with the correct account
- Check browser console for any errors

### Security Rules Errors
- Make sure Firestore rules are deployed
- Check that the rules allow admin access
- Verify the user document structure matches the expected format

---

## Security Best Practices

1. **Limit Admin Accounts**: Only create admin accounts for trusted users
2. **Strong Passwords**: Use strong, unique passwords for admin accounts
3. **Two-Factor Authentication**: Enable 2FA for admin accounts in Firebase Console
4. **Regular Audits**: Periodically review admin accounts and remove unnecessary ones
5. **Monitor Activity**: Use Firebase Analytics to monitor admin dashboard usage

---

## Quick Reference

- **Firestore Collection**: `users`
- **Document ID**: User UID (from Authentication)
- **Required Field**: `role: "admin"`
- **Admin Dashboard URL**: `/admin`
- **Security Rules File**: `firestore.rules`

