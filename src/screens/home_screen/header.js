import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import ToolbarButton from '../../components/toolbar_button';


export default function Header({ onTakePicture, onReload, onClear, onChoosePhoto }) {

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Sinfpics</Text>
      <View style={styles.buttonsContainer}>

        <ToolbarButton icon="delete" onPress={onClear} />
        <ToolbarButton icon="refresh" onPress={onReload} />
        <ToolbarButton icon="collections" onPress={onChoosePhoto} />
        <ToolbarButton icon="photo-camera" onPress={onTakePicture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: "white"
  },
})
