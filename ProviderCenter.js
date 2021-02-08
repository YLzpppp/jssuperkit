import { font,sw,sh,ww,wh,isPad,isAndroid,NullChecker,TypeChecker,EmptyFunc,LOG,TimeFormatter,NumberFormatter,Storage,replaceErrorContent,getPixel } from './base';

import {AppProvider,StyleProvider,ModalProvider} from './index';

global.BZApp = AppProvider.shared;
global.BZStyle = StyleProvider.shared;
global.BZModal = ModalProvider.shared;
global.BZToast = ModalProvider.shared.store;

global.BZTimeFormatter = TimeFormatter;
global.BZNumberFormatter = NumberFormatter;
global.BZStorage = Storage;
global.replaceErrorContent = replaceErrorContent;

global.font = font;
global.getPixel = getPixel;
global.sw = sw;
global.sh = sh;
global.ww = ww;
global.wh = wh;
global.isPad = isPad;
global.isAndroid = isAndroid;
global.NullChecker = NullChecker;
global.TypeChecker = TypeChecker;
global.EmptyFunc = EmptyFunc;
global.LOG = LOG;
global.di = LOG.info;
global.dw = LOG.warn;
global.de = LOG.error;

global.Space = 6;
global.Space1 = 8;
global.Space2 = 12;
global.Space3 = 14;
global.Space4 = 16;
global.Space5 = 18;
global.Space6 = 22;
global.Space7 = 24;
global.Space8 = 28;
global.Space9 = 36;

global.h1 = font(32);
global.h2 = font(20);
global.h3 = font(18);
global.h4 = font(16);
global.body = font(14);
global.caption = font(12);
global.footer = font(11);

global.radius = 4;
global.radius1 = 8;
global.radius2 = 12;
global.radius3 = 16;
global.radius4 = 20;
global.radius5 = 24;
global.radius6 = 30;