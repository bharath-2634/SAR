import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'

export default function Loading() {
  return (
    <View style={styles.container}>
        <ActivityIndicator color="#000" size="large"/>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "#fff",
        justifyContent:"center"
    }
})
