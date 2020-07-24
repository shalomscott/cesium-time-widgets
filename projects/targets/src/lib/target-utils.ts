import { Costume, Mood, Nationality, Target } from './models/target';
import { randomString, randomNumber, randomEnum, randomArray, randomDate, randomEnumArray, randomLatLng } from 'projects/general-utils/src/public-api';
import { v4 as uuid } from 'uuid';

export const emptyTarget = (): Target => {
    return {
        id: undefined,
        name: undefined,
        nickname: undefined,
        latLng: undefined,
        updateTime: undefined,
        mood: undefined,
        nationality: undefined,
        costumes: [],
    };
};

export const randomTarget = (): Target => {
    return {
        id: uuid(),
        name: randomString(randomNumber(5, 10)),
        nickname: randomString(randomNumber(5, 10)),
        latLng: randomLatLng(),
        updateTime: randomDate(),
        mood: randomEnum(Mood),
        nationality: randomEnum(Nationality),
        costumes: randomEnumArray(5, Costume),
    };
};

