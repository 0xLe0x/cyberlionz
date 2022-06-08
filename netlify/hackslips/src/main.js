const basePath = process.cwd()
const { NETWORK } = require(`../constants/network.js`)
const fs = require('fs')
const sha1 = require(`sha1`)
const { createCanvas, loadImage } = require(`canvas`)
const buildDir = `${basePath}/netlify/hackslips/build`
const LAYERS_BUCKET_NAME = 'cyberlions-layers-internal'
const layersDir = `https://${LAYERS_BUCKET_NAME}.s3.amazonaws.com`
const {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
} = require(`../src/config.js`);
const path = require("path");
let canvas = createCanvas(format.width, format.height);
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const HashlipsGiffer = require(`../modules/HashlipsGiffer.js`);

let hashlipsGiffer = null;

var AWS = require('aws-sdk')

const { CL_S3_ACCESS_KEY_ID, CL_S3_SECRET_ACCESS_KEY, CL_S3_BUCKET_NAME } =
	process.env
AWS.config.update({
	accessKeyId: CL_S3_ACCESS_KEY_ID,
	secretAccessKey: CL_S3_SECRET_ACCESS_KEY,
})

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    // fs.rmSync(buildDir, { recursive: true });
    return;
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  // fs.mkdirSync(`${buildDir}/images`);
  if (gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.replace(/\.png$/, "");
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.replace(/\.png$/, "");
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = async (path) => {
	var s3 = new AWS.S3()
	
	var params = {
		Bucket: LAYERS_BUCKET_NAME,
		Delimiter: '/',
		Prefix: path  // Can be your folder name
	};
	try {
		const data = await s3.listObjects(params).promise();
		
		const contents = data.Contents.map((i, index) => {
			if (i.Key.includes('-')) {
				throw new Error(`layer name can not contain dashes, please fix: ${i.Key}`)
			}
			return {
				id: index,
				name: cleanName(i.Key.split('/')[1]),
				filename: i.Key.split('/')[1],
				path: `${i.Key}`,
				weight: 0,
			}
		})
		const prefixes = data.CommonPrefixes.map((i, index) => {
			if (i.Prefix.includes('-')) {
				throw new Error(`layer name can not contain dashes, please fix: ${i.Prefix}`)
			}
			return {
				id: index + contents.length,
				name: cleanName(i.Prefix.split('/')[1]),
				filename: i.Prefix.split('/')[1],
				path: `${i.Prefix}`,
				weight: 0,
			}
		})
		const result = contents.concat(prefixes)

		return result
	} catch(err) {
		console.log(err)
	}
}

const layersSetup = async (layersOrder) => {
	const layers = await Promise.all(layersOrder.map(async (layerObj, index) => ({
		id: index,
		elements: await getElements(`${layerObj.name}/`),
		name:
			layerObj.options?.['displayName'] != undefined
				? layerObj.options?.['displayName']
				: layerObj.name,
		blend:
			layerObj.options?.['blend'] != undefined
				? layerObj.options?.['blend']
				: 'source-over',
		opacity:
			layerObj.options?.['opacity'] != undefined
				? layerObj.options?.['opacity']
				: 1,
		bypassDNA:
			layerObj.options?.['bypassDNA'] !== undefined
				? layerObj.options?.['bypassDNA']
				: false,
	})))
	return layers
}

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: `${baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
    compiler: "HashLips Art Engine",
  };
  if (network == NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      image: `${_edition}.png`,
      //Added metadata for solana
      external_url: solanaMetadata.external_url,
      edition: _edition,
      ...extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: solanaMetadata.creators,
      },
    };
  }
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer) => {
	var s3 = new AWS.S3()

	try {
		return new Promise(async (resolve) => {
			const isDir = !_layer.selectedElement.filename.includes('.png')
			let image = null,
				images = []
			if (isDir) {
				for (let i = 1; i <= 8; i++) {
          console.log(`${_layer.selectedElement.path}${i}.png`)
          const data = await s3
            .getObject({
              Bucket: LAYERS_BUCKET_NAME,
              Key: `${_layer.selectedElement.path}${i}.png`,
            })
            .promise()
					let temp = await loadImage(data.Body)
					images.push(temp)
				}
			} else {
        const data = await s3
            .getObject({
              Bucket: LAYERS_BUCKET_NAME,
              Key: `${_layer.selectedElement.path}`,
            })
            .promise()
				image = await loadImage(data.Body)
			}
			resolve({
				layer: _layer,
				loadedImage: image,
				images,
				iterate: images.length > 0,
			})
		})
	} catch (error) {
		console.error('Error loading image:', error)
	}
}

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (
  _renderObject,
  _index,
  _layersLen,
  _addAttribute = false
) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1),
        text.size
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height
      );

  if (_addAttribute) {
    addAttributes(_renderObject);
  }
};

const constructLayerToDna = (_dna = "", _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers, _query) => {
  let randNum = [];
  _layers.forEach((layer) => {
    // var totalWeight = 0;
    // layer.elements.forEach((element) => {
    //   totalWeight += element.weight;
    // });
    // number between 0 - totalWeight
    // let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      // random -= layer.elements[i].weight;
      // if (random < 0) {
      //   console.log(
      //     `${layer.elements[i].id}:${layer.elements[i].filename}${
      //       layer.bypassDNA ? "?bypassDNA=true" : ""
      //     }`
      //   );
      //   return randNum.push(
      //     `${layer.elements[i].id}:${layer.elements[i].filename}${
      //       layer.bypassDNA ? "?bypassDNA=true" : ""
      //     }`
      //   );
      // }
      if (
        layer.elements[i].path.includes(layer.name) &&
        layer.elements[i].name.split('#')[0] === _query[layer.name]
      ) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async (query, filename) => {
	let layerConfigIndex = 0
	let editionCount = 1
	let failedCount = 0
	let abstractedIndexes = []
	for (
		let i = network == NETWORK.sol ? 0 : 1;
		i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
		i++
	) {
		abstractedIndexes.push(i)
	}
	if (shuffleLayerConfigurations) {
		abstractedIndexes = shuffle(abstractedIndexes)
	}
	debugLogs ? console.log('Editions left to create: ', abstractedIndexes) : null
	while (layerConfigIndex < layerConfigurations.length) {
		const layers = await layersSetup(layerConfigurations[layerConfigIndex].layersOrder)
		while (
			editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
		) {
			let newDna = createDna(layers, query)
			//      if (isDnaUnique(dnaList, newDna)) {
			let results = constructLayerToDna(newDna, layers)
			let loadedElements = []

      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });

      await Promise.all(loadedElements).then((renderObjectArray) => {
        debugLogs ? console.log("Clearing canvas") : null;
        //ctx.clearRect(0, 0, format.width, format.height);
        if (gif.export) {
          hashlipsGiffer = new HashlipsGiffer(
            canvas,
            ctx,
            // `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
            `${buildDir}/gifs/${filename}.gif`,
            gif.repeat,
            gif.quality,
            gif.delay
          );
          hashlipsGiffer.start();
        }

        // 8 time steps in our gif
        for (let i = 1; i <= 8; i++) {
          ctx.clearRect(0, 0, format.width, format.height);
          if (background.generate) {
            drawBackground();
          }

          // combine all layers onto canvas
          renderObjectArray.forEach((renderObject, index) => {
            const { layer, iterate, loadedImage } = renderObject;

            const imageObject = {
              layer,
              loadedImage: iterate ? renderObject.images[i - 1] : loadedImage,
            };

            drawElement(
              imageObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length,
              i == 1 // only add an attribute to metadata if this is the first frame
            );
          });

          // add a frame
          if (gif.export) {
            hashlipsGiffer.add();
          }
        }
        // trigger save of the whole sequence
        if (gif.export) {
          hashlipsGiffer.stop();
        }
        debugLogs
          ? console.log("Editions left to create: ", abstractedIndexes)
          : null;
        // saveImage(abstractedIndexes[0]);
        addMetadata(newDna, abstractedIndexes[0]);
        saveMetaDataSingleFile(abstractedIndexes[0]);
        console.log(
          `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(newDna)}`
        );
      });
      dnaList.add(filterDNAOptions(newDna));
      editionCount++;
      abstractedIndexes.shift();
      // } else {
      //   console.log("DNA exists!");
      //   failedCount++;
      //   if (failedCount >= uniqueDnaTorrance) {
      //     console.log(
      //       `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
      //     );
      //     process.exit();
      //   }
      // }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
