import * as RNFS from 'react-native-fs';
import RNFU from 'react-native-file-utils';


const PICS_FOLDER = `${RNFU.PicturesDirectoryPath}/casepics`

const getPics = async (caseName) => {
    let caseFolder = `${PICS_FOLDER}/${caseName}`;
    await prepareFolder(caseFolder);
    let files = await RNFS.readDir(caseFolder)
    files = files.filter((file) => file.isFile() && (file.name.endsWith(".jpg") || file.name.endsWith(".png")))
    return files.map(file => {
        return {
            name: file.name.replace(/\.[^/.]+$/, ""),
            source: "file://" + file.path + "#" + Math.random()
        }
    })
}

const clearFolder = async (caseName) => {
    let caseFolder = `${PICS_FOLDER}/${caseName}`;
    let files = await RNFS.readDir(caseFolder)
    files.forEach(async (file) => {
        await RNFS.unlink(file.path)
    });
}

const deletePicture = async (pic) => {
    const path = pic.source.replace("file://", "").split("#")[0]
    await RNFS.unlink(path)
}


async function renamePicture(pic, name, caseName) {
    const path = pic.source.replace("file://", "").split("#")[0]
    const info = await savePicture(path, name, caseName)
    return "file://" + info.path + "#" + Math.random()
}

async function savePicture(tempPath, name, caseName) {
    let caseFolder = `${PICS_FOLDER}/${caseName}`;
    await prepareFolder(caseFolder);
    let newName = name
    let fullName = `${newName}.jpg`
    let destPath = `${caseFolder}/${fullName}`
    let i = 1
    while (await RNFS.exists(destPath)) {
        newName = `${name}_${i}`
        fullName = `${newName}.jpg`
        destPath = `${caseFolder}/${fullName}`;
        i++
    }

    if (tempPath.startsWith("file://")) {
        tempPath = tempPath.replace("file://", "");
    }
    await RNFS.moveFile(tempPath, destPath)
    return {
        name: newName,
        path: destPath
    }
}

const prepareFolder = async (folder) => {
    if (folder !== undefined) {
        const exists = await RNFS.exists(folder)
        if (!exists) {
            await RNFS.mkdir(folder)
        }
        return
    }
    //Case folder not provided check the main folder
    const exists = await RNFS.exists(PICS_FOLDER)
    if (!exists) {
        await RNFS.mkdir(PICS_FOLDER)
    }

}


const getCases = async () => {
    await prepareFolder();
    let entries = await RNFS.readDir(PICS_FOLDER);
    entries = entries.filter((entry) => entry.isDirectory());
    return entries.map(entry => {
        return entry.name.replace(/\.[^/.]+$/, "")
    })

}

const createCase = async (name) => {
    const path = `${PICS_FOLDER}/${name}`;
    const exists = await RNFS.exists(path);
    if (!exists) {
        await RNFS.mkdir(path);
    }
    return name;
}

const deleteCase = async (name) => {
    const path = `${PICS_FOLDER}/${name}`;
    const exists = await RNFS.exists(path);
    if (exists) {
        await RNFS.unlink(path);
    }
}

const renameCase = async (oldName, newName) => {
    const oldPath = `${PICS_FOLDER}/${oldName}`;
    const newPath = `${PICS_FOLDER}/${newName}`;
    const exists = await RNFS.exists(oldPath);
    if (exists) {
        await RNFS.moveFile(oldPath, newPath)
    }
    return newName;
}

const saveNote = async (name, caseName, text) => {
    const path = `${PICS_FOLDER}/${caseName}/${name}.txt`;
    text = text.trim();
    if (text == "") {
        const exists = await RNFS.exists(path);
        if (exists) {
            await RNFS.unlink(path);
        }
        return
    }
    RNFS.writeFile(path, text, 'utf8')
}

const getNote = async (name, caseName) => {
    const path = `${PICS_FOLDER}/${caseName}/${name}.txt`;
    const exists = await RNFS.exists(path);
    if (exists) {
        return await RNFS.readFile(path, 'utf8');
    }
    return ""
}


export {
    savePicture,
    PICS_FOLDER,
    getPics,
    clearFolder,
    deletePicture,
    renamePicture,
    prepareFolder,
    getCases,
    deleteCase,
    createCase,
    renameCase,
    saveNote, 
    getNote
}