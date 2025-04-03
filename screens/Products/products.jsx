import React, { useEffect, useState } from 'react';
import { 
    View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Platform 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-flash-message';
import { showMessage } from "react-native-flash-message";

const Products = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = auth().currentUser?.uid;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = [];
                const querySnapshot = await firestore().collection('products').get();
                querySnapshot.forEach(doc => {
                    productList.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            if (!userId) return;
            try {
                const userDoc = await firestore().collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setCart(userData.Cart || []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchProducts();
        fetchUserData();
    }, [userId]);

    const toggleCart = async (productId) => {
        if (!userId) return;

        const userRef = firestore().collection('users').doc(userId);
        const updatedCart = cart.includes(productId)
            ? cart.filter(id => id !== productId)
            : [...cart, productId];

        setCart(updatedCart);

        try {
            await userRef.update({ Cart: updatedCart });
            showMessage({
                message: cart.includes(productId) ? "Removed from Cart" : "Added to Cart",
                type: "info",
                position: "bottom",
            });
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Products...</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.ProductName}</Text>
            <Text style={styles.productPrice}>${item.ProductPrice}</Text>

            {/* Cart Button */}
            <TouchableOpacity onPress={() => toggleCart(item.id)} style={styles.cartButton}>
                <Icon name={cart.includes(item.id) ? 'shopping-cart' : 'cart-plus'} size={24} color="green" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={renderItem}
                contentContainerStyle={styles.gridContainer}
            />

            {/* Floating Cart Button */}
            <TouchableOpacity 
                style={styles.floatingCartButton} 
                onPress={() => navigation.navigate('CartScreen', { cartItems: cart })}
            >
                <Icon name="shopping-cart" size={24} color="#fff" />
                <Text style={styles.cartButtonText}>Cart ({cart.length})</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainer: {
        paddingBottom: 80,
    },
    productCard: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
        marginTop: 3,
    },
    cartButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    floatingCartButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "bold",
    },
});

export default Products;
