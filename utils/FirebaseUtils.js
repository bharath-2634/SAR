import auth from '@react-native-firebase/auth';

// Function to Listen for Authentication Changes
export const authStateListener = (callback) => {
  return auth().onAuthStateChanged(user => {
    callback(user); // Pass the user object to update state in the app
  });
};

// Function to Sign Up a User
export const signUp = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to Sign In a User
export const signIn = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to Sign Out
export const signOut = async () => {
  try {
    await auth().signOut();
    return true;
  } catch (error) {
    throw error;
  }
};

// Function to Check Current User
export const getCurrentUser = () => {
  return auth().currentUser;
};
