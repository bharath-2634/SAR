import auth from '@react-native-firebase/auth';

// Function to Sign Up a User
export const signUp = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user; // Return user data
  } catch (error) {
    throw error; // Handle error in calling component
  }
};

// Function to Sign In a User
export const signIn = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user; // Return user data
  } catch (error) {
    throw error; // Handle error in calling component
  }
};

// Function to Sign Out
export const signOut = async () => {
  try {
    await auth().signOut();
    return true; // Sign-out success
  } catch (error) {
    throw error; // Handle error in calling component
  }
};

// Function to Check Current User
export const getCurrentUser = () => {
  return auth().currentUser;
};
