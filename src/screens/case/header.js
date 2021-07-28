import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import ToolbarButton from '../../components/toolbar_button';
import values from '../../values';


export default function Header({ onTakePicture, onReload, onClear, onChoosePhoto, onBack, title }) {

  return (
    <View style={styles.header}>
      <View style={styles.containerTitle} >
        <ToolbarButton icon="arrow-back" onPress={onBack}/>
        <Text style={styles.headerText}>{title}</Text>
      </View>

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
    paddingLeft: 5,
    paddingRight: 10,
    width: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: values.blue_color,
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerTitle:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "white"
  },
})
