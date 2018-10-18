import BaseScene from './base'
import mainFontImagePath from '../../../assets/fonts/main.png'
import mainFontFilePath from '../../../assets/fonts/main.fnt'

import iconPath from '../../../assets/icon.png'
import uiImagePath from '../../../assets/ui.png'
import uiAtlasPath from '../../../assets/ui.json'
/**
* Just preload basic ui assets as quick possible and move to screen with connecting
*/
export default class BootScene extends BaseScene {
  preload() {
    this.load.atlas('ui', uiImagePath, uiAtlasPath)
    this.load.image('logo', iconPath)
    this.load.bitmapFont('main', mainFontImagePath, mainFontFilePath)
  }

  create() {
    this.scene.start('connection')
  }
}
