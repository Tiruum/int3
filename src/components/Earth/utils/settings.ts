import { Dispatch } from 'store/typed';
import { UserConfig } from 'models/UserInfo';

import {
    setAntialiasing,
    setCameraExposure,
    setFancyLighting,
    setFramesBetweenFade,
    setGroupColors,
    setGroupPointShapes,
    setGroupPointSize,
    setProjection,
    setReferenceFrame,
    setSatCaptureColor,
    setSatCaptureFade,
    setSatLineColor,
    setSatLineFade,
    setSatViewColor,
    setSatViewFade,
    setTextureQuality
} from 'components/pipelineVariant/store/pipelineVariantVisualisationSlice/visualisationSlice';


export const initializeVisualizationSettings = (
    dispatch: Dispatch,
    config: UserConfig
) => {
    const {
        exposure,
        antialiasing,
        fancyLighting,
        textureQuality,
        projection,
        referenceFrame,
        groupColor,
        groupPointShape,
        groupPointSize,
        satLineColor,
        satCaptureColor,
        satViewColor,
        framesBetweenFade,
        satLineFade,
        satCaptureFade,
        satViewFade
    } = config.visualization?.results || {};

    exposure !== undefined && dispatch(setCameraExposure(exposure));
    antialiasing !== undefined && dispatch(setAntialiasing(antialiasing));
    fancyLighting !== undefined && dispatch(setFancyLighting(fancyLighting));
    textureQuality !== undefined && dispatch(setTextureQuality(textureQuality));
    projection !== undefined && dispatch(setProjection(projection));
    referenceFrame !== undefined && dispatch(setReferenceFrame(referenceFrame));
    groupColor !== undefined && dispatch(setGroupColors(groupColor));
    groupPointShape !== undefined && dispatch(setGroupPointShapes(groupPointShape));
    groupPointSize !== undefined && dispatch(setGroupPointSize(groupPointSize));
    satLineColor !== undefined && dispatch(setSatLineColor(satLineColor));
    satCaptureColor !== undefined && dispatch(setSatCaptureColor(satCaptureColor));
    satViewColor !== undefined && dispatch(setSatViewColor(satViewColor));
    framesBetweenFade !== undefined && dispatch(setFramesBetweenFade(framesBetweenFade));
    satLineFade !== undefined && dispatch(setSatLineFade(satLineFade));
    satCaptureFade !== undefined && dispatch(setSatCaptureFade(satCaptureFade));
    satViewFade !== undefined && dispatch(setSatViewFade(satViewFade));
};
