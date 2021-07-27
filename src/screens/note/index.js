import { Button, StyleSheet, View, TextInput, Text } from 'react-native';
import React, { useState } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';


export default function NoteScreen({ navigation, route }) {

    const [noteText, setNoteText] = useState("");
    const caseName = route.params.caseName;
    const picName = route.params.picName;

    return (
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>{caseName}</Text>
                <Text style={styles.title}>{picName}</Text>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={setNoteText}
                multiline
                value={noteText}
            />
            <Button style={styles.button} title="Gravar"></Button>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    containerTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },  
    input: {
        height: 500,
        borderWidth: 1,
        marginBottom: 10,
        textAlignVertical: 'top'
    },
    button: {
        marginTop: 10
    }

})
