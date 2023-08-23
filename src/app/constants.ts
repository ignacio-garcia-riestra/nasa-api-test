import { RoversExampleImages } from "./interfaces/RoversExampleImages";

export const ROVERS_IMAGES: RoversExampleImages = {
  curiosity:
    "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03924/opgs/edr/ncam/NLB_745844778EDR_F1031598NCAM00257M_.JPG",
  opportunity:
    "https://mars.nasa.gov/mer/gallery/all/1/p/4037/1P486569561EFFCNJDP2407R2M1-BR.JPG",
  spirit:
    "https://mars.nasa.gov/mer/gallery/all/2/n/2101/2N312879291EFFB215P1957L0M1-BR.JPG",
  perseverance:
    "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00458/ids/edr/browse/ncam/NLF_0458_0707590354_274ECM_N0260218NCAM13457_04_195J01_1200.jpg",
};

export const getRoversURL =
  "https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=DEMO_KEY";
