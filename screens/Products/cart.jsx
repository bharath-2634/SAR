import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const navigation = useNavigation();
    const userId = auth().currentUser?.uid;

    useEffect(() => {
        const fetchCartProducts = async () => {
            if (!userId) return;

            try {
                const userDoc = await firestore().collection('users').doc(userId).get();
                const cartItems = userDoc.exists ? userDoc.data().Cart || [] : [];

                if (cartItems.length === 0) return;

                const cartData = [];
                for (const productId of cartItems) {
                    const productDoc = await firestore().collection('products').doc(productId).get();
                    if (productDoc.exists) {
                        cartData.push({ id: productDoc.id, ...productDoc.data() });
                    }
                }
                setCartProducts(cartData);
            } catch (error) {
                console.error('Error fetching cart products:', error);
            }
        };

        fetchCartProducts();
    }, []);

    const calculateTotal = () => {
        return cartProducts.reduce((total, item) => total + parseFloat(item.ProductPrice), 0);
    };

    const handleCheckout = async () => {
        const totalAmount = calculateTotal();

        const options = {
            description: 'Order Payment',
            image: 'https://yourcompanylogo.com/logo.png', 
            currency: 'INR',
            key: 'rzp_test_yourKeyHere', 
            amount: totalAmount * 100,
            name: 'Your Company Name',
            prefill: {
                email: 'user@example.com',
                contact: '9999999999',
                name: 'User Name',
            },
            theme: { color: '#ff6f00' },
        };

        RazorpayCheckout.open(options)
            .then((data) => {
                Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
                navigation.navigate('PaymentSuccessScreen');
            })
            .catch((error) => {
                Alert.alert('Payment Failed', error.description);
            });
    };

    return (
        <View style={styles.container}>
            {cartProducts.length === 0 ? (
                <Text style={styles.emptyText}>Your cart is empty</Text>
            ) : (
                <>
                    <FlatList
                        data={cartProducts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                                <View>
                                    <Text style={styles.productName}>{item.ProductName}</Text>
                                    <Text style={styles.productPrice}>₹{item.ProductPrice}</Text>
                                </View>
                            </View>
                        )}
                    />
                    <Text style={styles.totalAmount}>Total: ₹{calculateTotal()}</Text>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutText}>One-Tap Pay</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    emptyText: { fontSize: 18, textAlign: "center", marginTop: 20, color: "#888" },
    cartItem: { flexDirection: "row", padding: 10, alignItems: "center", borderBottomWidth: 1, borderColor: "#ddd" },
    productImage: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
    productName: { fontSize: 16, fontWeight: "bold" },
    productPrice: { fontSize: 14, color: "#555" },
    totalAmount: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
    checkoutButton: { 
        backgroundColor: "#ff6f00", 
        padding: 15, 
        alignItems: "center", 
        margin: 10, 
        borderRadius: 8 
    },
    checkoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default CartScreen;
