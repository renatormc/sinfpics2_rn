import { TextInput, View, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, Modal, Alert, PermissionsAndroid, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import RBSheet from "react-native-raw-bottom-sheet";
import Header from './header';
import BottomSheet from "./bottom_sheet"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import prompt from 'react-native-prompt-android';
import { savePicture, getPics, clearFolder, deletePicture, renamePicture, PICS_FOLDER, saveNote } from "../../services/storage_manager";


const CaseScreen = ({ route, navigation }) => {

  // const navigation = useNavigation();

  const [objName, setObjName] = useState("");
  const [pics, setPics] = useState([]);
  const [selectedPicIndex, setSelectedPicIndex] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState("");
  const refRBSheet = useRef();
  const caseName = route.params.caseName;

  const reloadPics = async () => {
    try {
      const pics = await getPics(caseName);
      setPics(pics)
    } catch (error) {
      console.log(error)
    }
  }

  const clearFolderWrap = async () => {
    Alert.alert(
      'Deletar todas',
      'Tem certeza de que deseja deletar todas as fotos?',
      [

        {
          text: 'Não',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'SIM', onPress: async () => {
            await clearFolder(caseName);
            reloadPics();
          }
        }
      ],
      { cancelable: false }
    );
  }

  const takePicture = async () => {
    console.log("Tirar foto")
    if (objName == "") {
      Alert.alert(
        'Nome vazio',
        'É necessário definir o nome do objeto.',
        [
          {
            text: 'OK',
            onPress: () => { }
          }
        ],
        { cancelable: false }
      );
      return
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera({
          quality: 1,
          storageOptions: {
            skipBackup: true,
            privateDirectory: true
          },
        }, async (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const uri = response.assets[0].uri
            try {
              const info = await savePicture(uri, objName, caseName);
              let number = Math.random();
              setPics([...pics, { source: "file://" + info.path + "#" + number, name: info.name }]);
            } catch (error) {
              console.log(error)
            }


          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const pickPictures = async () => {
    if (objName == "") {
      Alert.alert(
        'Nome vazio',
        'É necessário definir o nome do objeto.',
        [
          {
            text: 'OK',
            onPress: () => { }
          }
        ],
        { cancelable: false }
      );
      return
    }
    try {
      launchImageLibrary({
        selectionLimit: 0,
        storageOptions: {
          skipBackup: true,
          path: '/storage/emulated/0/DCIM'
        },
      }, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let assets = response.assets;
          let newPics = [];
          for (let index = 0; index < assets.length; index++) {
            const uri = assets[index].uri;
            try {
              const info = await savePicture(uri, objName, caseName);
              let number = Math.random();
              newPics.push({ source: "file://" + info.path + "#" + number, name: info.name });

            } catch (error) {
              console.log(error)
            }
          }
          setPics([...pics, ...newPics]);



        }
      });
    } catch (err) {
      console.warn(err);
    }
  }

  const deletePic = async () => {
    refRBSheet.current.close();
    try {
      await deletePicture(pics[selectedPicIndex])
      pics.splice(selectedPicIndex, 1)
      setPics(pics);
      setSelectedPicIndex(-1);
    } catch (error) {
      alert(error)
    }
  }

  const renamePic = async () => {
    refRBSheet.current.close();
    const pic = pics[selectedPicIndex]
    prompt(
      'Novo nome',
      '',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: async name => {
            if (name == pic.name) {
              return
            }
            try {
              const source = await renamePicture(pic, name, caseName)
              let copyPics = [...pics];
              copyPics[selectedPicIndex] = {
                source: source,
                name: name
              }
              setPics(copyPics);

            } catch (error) {
              alert(error)
            }
          }
        },
      ],
      {
        type: 'text',
        cancelable: false,
        defaultValue: pics[selectedPicIndex].name,
        placeholder: 'Novo nome'
      }
    );

  }

  const vizualizePic = async (pic) => {
    if (pic == undefined) {
      pic = pics[selectedPicIndex];
    }
    refRBSheet.current.close();
    setImageModalUrl(pic.source);
    setModalVisible(true);
  }

  const goToCases = async () => {
    console.log("Ir para casos")
    navigation.navigate('Home');
  }

  const editNote = async () => {
    navigation.navigate('Note', {
      caseName: caseName,
      picName: pics[selectedPicIndex].name
  });
  }

  useEffect(() => {
    reloadPics();
  }, []);


  return (
    <View style={styles.container}>
      <Header title={caseName} onClear={clearFolderWrap} onTakePicture={takePicture} onReload={reloadPics} onChoosePhoto={pickPictures} onBack={goToCases} />
      <TextInput
        style={styles.input}
        onChangeText={setObjName}
        value={objName}
        placeholder="Nome do objeto"
      />
      <SafeAreaView>
        <FlatList
          horizontal={false}
          data={pics}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.listItemContainer}
              delayLongPress={200}
              onPress={() => {
                setSelectedPicIndex(index)
                vizualizePic(item)
              }}
              onLongPress={() => {
                setSelectedPicIndex(index);
                refRBSheet.current.open();
              }}
            >
              <View style={styles.listItemInnerContainer}>
                <Image
                  style={styles.listPicture}
                  source={{ uri: item.source }} />
                <Text>{item.name}</Text>
              </View>

            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
      <Modal
        visible={modalVisible}
        transparent={false}
        onRequestClose={() => {
          setModalVisible(false)
        }}>
        <ImageViewer imageUrls={pics.map(pic => {
          return { url: pic.source }
        })}
          index={selectedPicIndex}
        />
      </Modal>
      <RBSheet
        ref={refRBSheet}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: 250
          }
        }}
      >
        <BottomSheet
          onDeletePress={deletePic}
          onVizualizePress={vizualizePic}
          onRenamePress={renamePic}
          onEditNote={editNote}
        />
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingLeft: 5,
    paddingRight: 5,
  },
  listPicture: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  listItemContainer: {
    margin: 5,
    width: "30%"
  },
  listItemInnerContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center"
  }

})

export default CaseScreen;