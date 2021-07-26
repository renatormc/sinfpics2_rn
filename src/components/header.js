import {View, Text, StyleSheet} from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({navigation}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Sinfpics</Text>
      <Icon name="camera"  style={styles.headerIcon}/>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "white"

    },
    headerIcon: {
        color: "white",
        fontSize: 30
    }
})
