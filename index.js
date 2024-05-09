const puppeteer = require('puppeteer')
const fs = require('fs')
const axios = require('axios')
// const sharp = require('sharp')
let extractFilenameFromURLArray = [];

const downloadActualImageFromURL = async function(url, width, height, image_path, _extractFilenameFromURL) {

  try {
    if (width < 100 || height < 100) {
      console.log(`URL: ${url}- Width or Height is less than 100. Width: ${width}, Height: ${height}`);
      return;
    }
    if (extractFilenameFromURLArray.includes(_extractFilenameFromURL)) {
      return;
    }
    extractFilenameFromURLArray.push(_extractFilenameFromURL);
    const response = await axios({
      url,
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(image_path);
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('finish', () => {
        if (!error) {
          console.log('Image downloaded successfully:', image_path);

          const imageData = {
            filename: _extractFilenameFromURL,
            height: height,
            width: width,
            url: url,
          };

          fs.readFile('./images_detail_second.json', 'utf8', (err, data) => {
            if (err) {
              fs.writeFileSync('images_detail_second.json', JSON.stringify([imageData], null, 2));
            } else {
              const imageDetails = JSON.parse(data);
              imageDetails.push(imageData);
              fs.writeFileSync('./images_detail_second.json', JSON.stringify(imageDetails, null, 2));
            }
          });

          resolve();
        }
      });
    });
  } catch (err) {
    console.log("Error line 55: ", err);
  }
};

// const downloadAndResizeImage = async (url, width, height, outputPath, _extractFilenameFromURL) => {
//   if (width <= 0 || height <= 0) {
//     console.log(`URL: ${url}- Invalid width or height. Width: ${width}, Height: ${height}`);
//     return;
//   }
//   try {
//     if (extractFilenameFromURLArray.includes(_extractFilenameFromURL)) {
//       return;
//     }
//     extractFilenameFromURLArray.push(_extractFilenameFromURL);
//     const response = await axios({
//       url,
//       responseType: 'arraybuffer',
//     });

//     const resizedImageBuffer = await sharp(response.data)
//       .resize({ width, height })
//       .toBuffer();

//     fs.writeFileSync(outputPath, resizedImageBuffer);
//     console.log('Image downloaded and resized successfully:', outputPath);
//     const csvData = `${_extractFilenameFromURL},${width},${height},${url}\n`;
//     fs.appendFileSync('./images_detail_second.csv', csvData);
//     console.log('Image details added to CSV.');
//   } catch (error) {
//     console.error('Error downloading or resizing image:', error);
//   }
// };

async function searchImgUrls(URL) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(URL)
    const imagesData = await page.evaluate(() => {
      const $Imgs = [...document.getElementsByTagName('img')];
      console.log('$Imgs: ', $Imgs);
      return $Imgs.filter($Img => (!$Img.src.includes('data:image') && ($Img.src.includes('.jpg') || $Img.src.includes('.jpeg') || $Img.src.includes('.png') || $Img.src.includes('.webp')))).map($Img => ({
        url: $Img.src,
        width: $Img.width,
        height: $Img.height
      }))
    })
    await browser.close()
    return imagesData
  } catch (err) {
    console.log("Error Line 106: ", err);
  }
}

function extractFilenameFromURL(url) {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const queryIndex = lastPart.indexOf('?');
  if (queryIndex !== -1) {
      return lastPart.substring(0, queryIndex);
  } else {
      return lastPart;
  }
}

async function downloadImages() {
  const URLs = [
    'https://www.amazon.com',
    'https://v.hdfcbank.com/payzapp/index.html',
    'https://www.easemytrip.com/',
    'https://www.careinsurance.com/',
    'https://brainly.in/question/33324306',
    'https://licindia.in/hi/web/guest/home',
    'https://state.bihar.gov.in/transport/CitizenHome.html',
    'https://www.nykaa.com/brands/wanderlust/c/2674',
    'https://www.vedantu.com/',
    'https://www.aakash.ac.in/blog/category/toppers-speak/',
    'https://akashgautam.com/2018/11/30/how-to-find-your-passion-create-a-super-career-out-of-it/',
    'https://seller.flipkart.com/sell-online?utm_source=fkwebsite&utm_medium=websitedirect',
    'https://www.usa.gov/',
    'https://www.healthcare.gov/',
    'https://www.irs.gov/businesses',
    'https://travel.state.gov/content/travel/en/us-visas.html',
    'https://www.eurail.com/en/eurail-passes/one-country-pass/german-rail-pass',
    'https://www.aircanada.com/ca/en/aco/home.html',
    'https://www.klm.com/',
    'https://www.tripadvisor.in/',
    'https://www.schengenvisainfo.com/',
    'https://www.makemytrip.com/',
    'https://www.fda.gov/',
    'https://www.aha.org/',
    'https://education.ec.europa.eu/',
    'https://www.smurfitschool.ie/programmes/thesmurfitmba/fulltimemba/',
    'https://www.pw.live/',
    'https://www.cornell.edu/',
    'https://www.study-in-germany.de/en/plan-your-studies/study-options/higher-education-system/',
    'https://www.unicef.org/',
    'https://www.walmart.com/',
    'https://www.nykaa.com/',
    'https://www.ulysse-nardin.com/',
    'https://www.almowear.com/',
    'https://www.geico.com/',
    'https://www.metlife.ae/en/',
    'https://www.fwd.co.th/en/',
    'https://www.correos.es/es/en/individuals',
    'https://www.dhl.com/',
    'https://www.zivy.app/',
    'https://www.theverge.com/',
    'https://techcrunch.com/',
    'https://karat.com/',
    'https://www.lenskart.com/',
    'https://www.decathlon.ch/de/herren/sportschuhe-herren',
    'https://www.icicibank.com/',
    'https://www.bi.go.id/',
    'https://www.mashreq.com/en/uae/neo/',
    'https://www.quickheal.co.in/',
    'https://www.singtel.com/personal/products-services/broadband/fibre-broadband-plans',
    'https://www.ais.th/en/consumers',
    'https://find.shell.com/',
    'https://www.mpc-midhurstmacmillan.org',
    'https://www.mpc-midhurstmacmillan.org/our-service',
    'https://coronavirus.rio',
    'https://saude.prefeitura.rio/',
    'https://www.uerj.br/',
    'https://kaplanassessments.com',
    'https://www.eagle-education.co.uk/pricing/acca/',
    'https://www.eagle-education.co.uk/aat/',
    'https://cimastudy.com/cima-levels/strategic-level',
    'https://cimastudy.com/home',
    'https://support.osb.co.uk/',
    'https://olisclarity.com/',
    'https://www.healthinmind.org.uk/',
    'https://www.healthinmind.org.uk/courses',
    'https://www.healthinmind.org.uk/courses/sleep-well-course',
    'https://www.harley-davidson.com/us/en/index.html',
    'https://www.harley-davidson.com/us/en/tools/test-ride.html',
    'https://humboldtssecretsupplies.com',
    'https://humboldtssecretsupplies.com/products/ph-up',
    'https://corporate.dow.com/en-us.html',
    'https://www.sears.com',
    'https://www.bbc.co.uk',
    'https://www.nationwide.co.uk/',
    'https://www.kmart.com/',
    'https://www.next.co.uk/shop/promotion-coldweather-0',
    'https://kaplan.co.uk/courses/buy-a-course',
    'https://www.gov.uk/help',
    'https://www.qantas.com/au/en/travel-guides/australia.html',
    'https://gosadi.com/home',
    'https://www.monotypefonts.com',
    'https://www.sepa.org.uk',
    'https://www.netregs.org.uk',
    'https://www.airvistara.com/in/en'
  ];
  const PATH = './actual_images_second';

  try {
    for (const URL of URLs) {
      try {
        const imagesData = await searchImgUrls(URL);
        console.log(`Images data for ${URL}:`, imagesData);
        let counter = 0, imageCounter = 0;
        for (const image of imagesData) {
          if ( imageCounter >= 25) break;
          try {
            console.log('Image:', image);
            counter += 1;
            const _extractFilenameFromURL = extractFilenameFromURL(image.url);
            // await downloadAndResizeImage(image.url, image.width, image.height, `${PATH}/${_extractFilenameFromURL}`, _extractFilenameFromURL);
            await downloadActualImageFromURL(image.url, image.width, image.height, `${PATH}/${_extractFilenameFromURL}`, _extractFilenameFromURL);
            imageCounter += 1;
            console.log(`Downloading ${counter} of ${imagesData.length}`);
          } catch (err) {
            console.log("Error 158", err);
          }
        }
      } catch (err) {
        console.log("Error 162", err);
      }
    }
  } catch (err) {
    console.log('Error line 166:', err);
  }
}


downloadImages()
