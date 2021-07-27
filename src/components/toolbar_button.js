import { Pressable, StyleSheet, View } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function ToolbarButton({icon, onPress}) {
    return (
        <View style={styles.container}>
            <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    opacity: pressed
                        ? 0.5
                        : 1,
                }]} >
            <Icon name={icon} style={styles.icon} />

        </Pressable >
        </View>
        
    );
}


const styles = StyleSheet.create({
    container: {
        marginLeft: 25
    },
    icon: {
      color: "white",
      fontSize: 30
    },
  })
  