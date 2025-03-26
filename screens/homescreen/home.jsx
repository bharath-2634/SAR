import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Button } from 'react-native';
import { Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { signOut } from '../../utils/FirebaseUtils';
import { getCurrentUser } from '../../utils/FirebaseUtils'; 

export default function Home() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        async function fetchUser() {
            const user = await getCurrentUser();
            if (user) {
                setUserId(user.uid);
            }
        }
        fetchUser();
    }, []);

    const logOut = async () => {
        try {
            await signOut();
            navigation.replace('Login');
        } catch (error) {
            Alert.alert("Sorry, Try Again Later!");
        }
    };

    return (
        <View style={styles.homeContainer}>
            <View style={styles.header}>
                <Button title="Logout" onPress={logOut} style={styles.button} />
            </View>
            <View style={styles.header}>
                <Button title="Info" onPress={() => navigation.replace('Info')} style={styles.button} />
            </View>

            {/* ✅ Display QR Code Here */}
            <View style={styles.qrContainer}>
                <Text style={styles.qrText}>Scan to Get User ID</Text>
                {userId ? (
                    <QRCode value={userId} size={200} backgroundColor="white" color="black" />
                    // <Text>Hello</Text>
                ) : (
                    <Text style={styles.qrText}>Loading...</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        padding: 10,
    },
    button: {
        backgroundColor: '#888',
        borderRadius: 20,
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
