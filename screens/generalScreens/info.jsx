import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { getCurrentUser } from '../../utils/FirebaseUtils';
import firestore from '@react-native-firebase/firestore';

export default function Info() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    // State for user input
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        role: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            fetchUserData(currentUser.uid);
        }
    }, []);

    // Fetch user data from Firestore
    const fetchUserData = async (userId) => {
        try {
            const userDoc = await firestore().collection('users').doc(userId).get();
            if (userDoc.exists) {
                setUserData(userDoc.data());
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            Alert.alert("Error", "Failed to load user data.");
        }
    };

    // Handle input changes
    const handleChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    // Function to validate inputs
    const validateInputs = () => {
        const { name, age, phoneNumber } = userData;
        
        if (!name.trim()) {
            Alert.alert("Validation Error", "Name cannot be empty.");
            return false;
        }
        if (!/^\d+$/.test(age) || parseInt(age) <= 0) {
            Alert.alert("Validation Error", "Enter a valid age.");
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            Alert.alert("Validation Error", "Enter a valid 10-digit phone number.");
            return false;
        }
        return true;
    };

    // Save or update user data in Firestore
    const saveDataToFirestore = async () => {
        if (!validateInputs()) return;

        try {
            await firestore()
                .collection('users')
                .doc(user?.uid)
                .set(userData, { merge: true });

            Alert.alert("Success", "User data updated successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Firestore Error: ", error);
            Alert.alert("Error", `Failed to save user data: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Home'); // Navigate to Home if no back screen exists
                        }
                    }}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>

            <Text style={styles.header}>User Information</Text>

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={userData.name}
                onChangeText={(text) => handleChange('name', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Age"
                keyboardType="numeric"
                value={userData.age}
                onChangeText={(text) => handleChange('age', text)}
            />

            {/* Role Picker */}
            <View style={styles.dropDown}>
                <Text>Designation: </Text>
                <Picker
                    selectedValue={userData.role}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleChange('role', itemValue)}
                >
                    <Picker.Item label="Education" value="Education" />
                    <Picker.Item label="Homemaker" value="Homemaker" />
                    <Picker.Item label="Business" value="Business" />
                    <Picker.Item label="Sports" value="Sports" />
                    <Picker.Item label="Techie" value="Techie" />
                    <Picker.Item label="Foodie" value="Foodie" />
                </Picker>
            </View>

            {/* Gender Picker */}
            <View style={styles.dropDown}>
                <Text>Gender: </Text>
                <Picker
                    selectedValue={userData.gender}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleChange('gender', itemValue)}
                >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                value={userData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={saveDataToFirestore}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 50,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: 250,
        borderColor: '#000',
    },
});

