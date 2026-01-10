# Troubleshooting Guide

## Firebase Authentication Errors

### Error: `auth/operation-not-allowed`

This error occurs when Email/Password authentication is not enabled in Firebase Console.

#### Solution: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **stylesync-sistc**
3. Navigate to **Authentication** (in the left sidebar)
4. Click on the **Sign-in method** tab
5. Find **Email/Password** in the list of providers
6. Click on **Email/Password**
7. Toggle **Enable** to ON
8. Click **Save**

#### Alternative: Enable via Firebase CLI

```bash
firebase auth:export users.json
# Then enable in console as above
```

---

### Error: `auth/invalid-email`

The email address is not valid. Make sure:
- Email format is correct (e.g., `user@example.com`)
- No spaces in the email
- Contains @ symbol

---

### Error: `auth/weak-password`

Password is too weak. Firebase requires:
- At least 6 characters
- Consider adding password strength requirements in your app

---

### Error: `auth/email-already-in-use`

The email is already registered. Either:
- Use a different email
- Or go to Login page and sign in instead

---

### Error: `auth/user-not-found` or `auth/wrong-password`

- Check that the email is correct
- Check that the password is correct
- If you forgot your password, implement password reset (future feature)

---

## Firestore Errors

### Error: Missing or Insufficient Permissions

This means the Firestore security rules are blocking the operation.

#### Solution: Deploy Security Rules

1. Make sure `firestore.rules` file exists in your project root
2. Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

Or manually:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy contents from `firestore.rules`
3. Paste and click "Publish"

#### Check Rules Syntax

Make sure your rules file has no syntax errors. Common issues:
- Missing commas
- Incorrect function names
- Wrong collection paths

---

### Error: Collection Not Found

The collection doesn't exist yet. Firestore creates collections automatically when you write the first document.

**Solution**: The collection will be created automatically when you:
- Add your first product (creates `products` collection)
- Sign up a user (creates `users` collection)

---

## Deployment Errors

### Error: Build Fails

Check:
1. All dependencies are installed: `npm install`
2. No syntax errors in code
3. Environment variables are set (if any)

---

### Error: Firebase Hosting Deploy Fails

1. Make sure you're logged in: `firebase login`
2. Check that `firebase.json` is configured correctly
3. Verify the build completed: `npm run build`
4. Check that `dist` folder exists

---

## Common Issues

### Admin Link Not Showing

**Possible Causes:**
1. User role is not set to "admin" in Firestore
2. User is not logged in
3. Browser cache needs clearing

**Solution:**
1. Check Firestore `users` collection
2. Verify `role` field is exactly `"admin"` (lowercase, in quotes)
3. Log out and log back in
4. Clear browser cache (Ctrl+Shift+Delete)

---

### Products Not Showing

**Possible Causes:**
1. No products in Firestore
2. Firestore rules blocking read access
3. Network error

**Solution:**
1. Check Firestore `products` collection has documents
2. Verify security rules allow read access: `allow read: if true;`
3. Check browser console for errors
4. Check network tab for failed requests

---

### Cart Not Persisting

**Current Implementation:**
- Cart uses localStorage (browser storage)
- Cart persists per browser/device
- Not synced across devices

**Future Enhancement:**
- Store cart in Firestore for cross-device sync
- Requires user authentication

---

### Infinite Refresh Loop

**Solution:**
- Already fixed in recent updates
- Make sure you have the latest code
- Clear browser cache
- Check browser console for errors

---

## Getting Help

1. Check browser console for detailed error messages
2. Check Firebase Console for authentication and Firestore errors
3. Review the error code in Firebase documentation
4. Check GitHub issues (if applicable)

---

## Quick Fixes Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Firestore security rules deployed
- [ ] User document exists in `users` collection
- [ ] User role is set to "admin" (if needed)
- [ ] Browser cache cleared
- [ ] Logged out and logged back in
- [ ] Checked browser console for errors
- [ ] Verified Firebase project ID matches in `firebase.js`

