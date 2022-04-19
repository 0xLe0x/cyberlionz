import { promises as fs} from 'fs';
import path from 'path';
import { capitalCase } from 'change-case'

function rarity(remainder, n){
	if(n == 1) return remainder.toFixed(2)
	const seed = Math.random()
	return (seed * remainder / (n - 1)).toFixed(2)
}

function stripRarity(filenamish){
	return filenamish.split("#")[0]
}

const { readdir } = fs
const layersDir = path.resolve('layers');
const folders = await readdir(layersDir);
let rarityTable = {}
// console.log(folders)
for(const folder of folders){
	if(folder.match(/\.DS_Store/)){
		await fs.unlink(path.resolve(layersDir, folder))
		continue
	}
	rarityTable[folder] = {}
	const attribDir = path.resolve(layersDir, folder)
	const filesAndFolders = await readdir(attribDir)
	// console.log(filesAndFolders)
	let i = 0
	let n = filesAndFolders.length
	let remainder = 100
	// let r = rarity(remainder, n)
	let r = (100 / n).toFixed(2)
	let checksum = 0
	for(const attribName of filesAndFolders){
		if(i == n - 1){
			r = remainder.toFixed(2)
		}
		if(attribName.match(/\.DS_Store/)){
			await fs.unlink(path.resolve(attribDir, attribName))
			continue
		}
		checksum += Number(r)
		const attribPath = path.resolve(attribDir, attribName)
		const isDir = (await fs.lstat(attribPath)).isDirectory()
		if(isDir){
			//console.log('this is a directory', attribPath)
			let folderName = stripRarity(attribName)
			// folderName = capitalCase(folderName) // sanitize to Capital Case
			console.log(folderName)
			rarityTable[folder][folderName] = Number(r)
			// folderName = folderName.replace("Lion Cub "+folder+" ", "")
			// await fs.rename(attribPath, path.resolve(attribDir, `${folderName}`));
			await fs.rename(attribPath, path.resolve(attribDir, `${folderName}#${r}`));

			// turns all frames into 1-8.png
			/*
			const frames = await readdir(path.resolve(attribPath))
			for(const frame of frames){
			   const newName = frame.replace(attribName, "");
			   await fs.rename(path.resolve(attribPath, frame), path.resolve(attribPath, newName));
			}
			*/
		} else {
			//console.log('this is a file', attribPath)
			const ext = path.extname(attribName);
			let filename = path.basename(attribName, ext);
			filename = stripRarity(filename)
			// filename = capitalCase(filename) // sanitize to Capital Case
			rarityTable[folder][filename] = Number(r)
			// filename = filename.replace("Lion Cub "+folder+" ", "")
			// console.log(filename)
			// await fs.rename(attribPath, path.resolve(attribDir, `${filename}${ext}`));
			await fs.rename(attribPath, path.resolve(attribDir, `${filename}#${r}${ext}`));
		}
		remainder -= Number(r)
		i++
		// n--
		// r = rarity(remainder, n)
	}
	console.log("checksum on rarities used ", checksum)
}
await fs.writeFile("rarity-table.json", JSON.stringify(rarityTable));


