import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import firestore from '@react-native-firebase/firestore';
import { signOut, getCurrentUser } from '../../utils/FirebaseUtils'; 

export default function Home() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const user = await getCurrentUser();
            if (user) {
                setUserId(user.uid);
                checkUserLoggedIn(user.uid);
            } else {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    // Function to check if the user is logged in from Firestore
    const checkUserLoggedIn = async (uid) => {
        try {
            const userRef = firestore().collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const isLoggedIn = userDoc.data().loggedIn;
                if (isLoggedIn) {
                    navigation.replace('Products');  // Redirect to Products page
                }
            }
        } catch (error) {
            console.error('Error fetching user login status:', error);
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        try {
            await signOut();
            navigation.replace('Login');
        } catch (error) {
            Alert.alert("Sorry, Try Again Later!");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Checking login status...</Text>
            </View>
        );
    }

    return (
        <View style={styles.homeContainer}>
            <View style={styles.header}>
                <Button title="Logout" onPress={logOut} />
            </View>
            <View style={styles.header}>
                <Button title="Info" onPress={() => navigation.replace('Info')} />
            </View>

            <View style={styles.qrContainer}>
                <Text style={styles.qrText}>Scan to Get User ID</Text>
                {userId ? (
                    <QRCode value={userId} size={200} backgroundColor="white" color="black" />
                ) : (
                    <Text style={styles.qrText}>Loading...</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
    header: {
        width: '100%',
        padding: 10,
    },
    qrContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    qrText: {
        color: 'black',
        fontSize: 18,
        marginBottom: 10,
    },
});

// export default Home;
