import * as RNFS from 'react-native-fs';
import RNFU from 'react-native-file-utils';


const PICS_FOLDER = `${RNFU.PicturesDirectoryPath}/sinfpics`
// const PICS_FOLDER = `/storage/emulated/0/sinfpics`

const getPics = async () => {
    await prepareFolder()
    let files = await RNFS.readDir(PICS_FOLDER)
    files = files.filter((file) => file.isFile())
    return files.map(file => {
        return {
            name: file.name.replace(/\.[^/.]+$/, ""),
            source: "file://" + file.path + "#" + Math.random()
        }
    })

}

const clearFolder = async () => {
    let files = await RNFS.readDir(PICS_FOLDER)
    files.forEach(async (file) => {
        await RNFS.unlink(file.path)
    });
}

const deletePicture = async (pic) => {
    const path = pic.source.replace("file://", "").split("#")[0]
    await RNFS.unlink(path)
}


async function renamePicture(pic, name) {
    const path = pic.source.replace("file://", "").split("#")[0]
    const info = await savePicture(path, name)
    return "file://" + info.path + "#" + Math.random()
}

async function savePicture(tempPath, name) {
    await prepareFolder()
    let newName = name
    let fullName = `${newName}.jpg`
    let destPath = `${PICS_FOLDER}/${fullName}`
    let i = 1
    while (await RNFS.exists(destPath)) {
        newName = `${name}_${i}`
        fullName = `${newName}.jpg`
        destPath = `${PICS_FOLDER}/${fullName}`;
        i++
    }

    if(tempPath.startsWith("file://")){
        tempPath = tempPath.replace("file://", "");
    }
    await RNFS.moveFile(tempPath, destPath)
    return {
        name: newName,
        path: destPath
    }
}

const prepareFolder = async () => {
    const exists = await RNFS.exists(PICS_FOLDER)
    if (!exists) {
        await RNFS.mkdir(PICS_FOLDER)
    }
}




export { savePicture, PICS_FOLDER, getPics, clearFolder, deletePicture, renamePicture, prepareFolder }